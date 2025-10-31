package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"madi/preview"
)

func main() {
	r := gin.Default()
	r.Use(cors())

	r.GET("/api/health", func(c *gin.Context) { c.JSON(http.StatusOK, gin.H{"status":"ok"}) })
	r.GET("/api/preview", preview.Handle) // ?url=

	srv := &http.Server{
		Addr:           ":8080",
		Handler:        r,
		ReadTimeout:    5 * time.Second,
		WriteTimeout:   10 * time.Second,
		MaxHeaderBytes: 1 << 20,
	}
	log.Println("Go API on http://localhost:8080")
	log.Fatal(srv.ListenAndServe())
}

func cors() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(200); return
		}
		c.Next()
	}
}
