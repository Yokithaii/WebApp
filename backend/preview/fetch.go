package preview

import (
	"errors"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
)

var (
	reTitle = regexp.MustCompile(`(?is)<title[^>]*>(.*?)</title>`)
	reMeta  = regexp.MustCompile(`(?is)<meta\s+(?:name|property)=["'](?:og:description|description)["']\s+content=["'](.*?)["']`)
	reIcon  = regexp.MustCompile(`(?is)<link[^>]+rel=["'](?:icon|shortcut icon)["'][^>]*href=["'](.*?)["']`)
)

type Preview struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
	FinalURL    string `json:"finalUrl"`
	Domain      string `json:"domain"`
	HasResults  bool   `json:"hasResults"`
}

func Handle(c *gin.Context) {
	raw := c.Query("url")
	if raw == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error":"missing url"})
		return
	}
	u, err := url.Parse(raw)
	if err != nil || !u.IsAbs() {
		c.JSON(http.StatusBadRequest, gin.H{"error":"bad url"})
		return
	}
	body, finalURL, err := fetch(u.String())
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{"error": err.Error()})
		return
	}

	title := findFirst(reTitle, body)
	desc := findFirst(reMeta, body)
	icon := resolveIcon(u, findFirst(reIcon, body))

	c.JSON(http.StatusOK, Preview{
		Title:       truncate(title, 160),
		Description: truncate(desc, 240),
		Icon:        icon,
		FinalURL:    finalURL,
		Domain:      u.Hostname(),
		HasResults:  detectSearchResults(u.Hostname(), body),
	})
}

func fetch(u string) (string, string, error) {
	client := &http.Client{
		Timeout: 7 * time.Second,
		CheckRedirect: func(req *http.Request, via []*http.Request) error {
			if len(via) > 5 {
				return errors.New("too many redirects")
			}
			return nil
		},
	}
	req, _ := http.NewRequest("GET", u, nil)
	req.Header.Set("User-Agent", "madi-preview/1.0")
	resp, err := client.Do(req)
	if err != nil {
		return "", "", err
	}
	defer resp.Body.Close()
	if resp.StatusCode >= 400 {
		return "", "", errors.New(resp.Status)
	}
	b, _ := io.ReadAll(io.LimitReader(resp.Body, 1<<20))
	return string(b), resp.Request.URL.String(), nil
}

func findFirst(re *regexp.Regexp, s string) string {
	m := re.FindStringSubmatch(s)
	if len(m) >= 2 {
		return strings.TrimSpace(htmlUnescape(m[1]))
	}
	return ""
}

func resolveIcon(base *url.URL, href string) string {
	if href == "" {
		return ""
	}
	u, err := url.Parse(href)
	if err != nil {
		return ""
	}
	return base.ResolveReference(u).String()
}

func truncate(s string, n int) string {
	if len([]rune(s)) <= n { return s }
	rs := []rune(s); return string(rs[:n]) + "…"
}

func htmlUnescape(s string) string {
	r := strings.NewReplacer("&amp;","&","&lt;","<","&gt;",">","&quot;","\"", "&#39;", "'")
	return r.Replace(s)
}

// crude detection for "no results" to hide useless search links
func detectSearchResults(host, body string) bool {
	low := strings.ToLower(body)
	if strings.Contains(host, "google.") {
		// has result blocks or "Ничего не найдено" phrase
		if strings.Contains(low, "ничего не найдено") || strings.Contains(low, "did not match any documents") {
			return false
		}
		if strings.Contains(low, `id="search"`) && (strings.Contains(low, "/url?q=") || strings.Contains(low, "class=\"g\"")) {
			return true
		}
	}
	if strings.Contains(host, "yandex.") {
		if strings.Contains(low, "ничего не нашлось") { return false }
		if strings.Contains(low, "serp-list") || strings.Contains(low, "organic__url") { return true }
	}
	// fallback: if title exists, assume usable
	return true
}
