import './App.css'
function Post({title, body}) {
    return <div id= "card">
        <h2>{title}</h2>
        <p id= "preview">{body}</p>
    </div>
}
export default Post