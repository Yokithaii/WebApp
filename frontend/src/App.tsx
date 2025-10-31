import Wizard from "./components/Wizard";
import "./styles.css";
export default function App(){
  return (<>
    <div className="topbar">
      <div className="container" style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><strong>Проверка цитаты</strong> <span className="kbd">MADI</span></div>
        <nav><a href="#about">О методе</a><a href="#demo">Демо</a></nav>
      </div>
    </div>
    <div className="container">
      <Wizard/>
      <section id="about" style={{marginTop:24}} className="card">
        <h3 style={{color:"var(--madi-blue)"}}>О методе / дисклеймер</h3>
        <p>Инструмент помогает искать первоисточники и контекст. Мы не выносим «вердиктов» и не собираем персональные данные. История хранится локально.</p>
      </section>
      <section id="demo" style={{marginTop:24}} className="card">
        <h3 style={{color:"var(--madi-blue)"}}>Демо-кейсы</h3>
        <ol>
          <li>Цитата с многоточиями — проверьте полную стенограмму.</li>
          <li>Переводная цитата — найдите оригинал на языке источника.</li>
          <li>Старая «вирусная» цитата — проверьте дату публикации и архив.</li>
        </ol>
      </section>
    </div>
  </>);
}
