function Image (props) {
    return(
        <article className="image-card"  >
        <h2 className="title">{props.image.title} 
          <button className="delete-button-card" 
          onClick={() => props.deleteImage(props.image.id)} >Delete</button>
        </h2>
        <img src={`${props.image.image}`} className={`${props.image.title}`} />
        <div className="likes-section">
          <span className="likes">{`${props.image.likes} likes`}</span>
          <button className="like-button" onClick={() => {
            props.addLike(props.image)
          }}>♥</button>
        </div>
        <ul className="comments">
          {props.image.comments.map((comment) => (
            <li key={comment.id}>{`${comment.content}`}
              <button
                className='delet-coment-btn'
                onClick={
                  function () {
                    props.deleteComments(comment)
                  }
                }
              >x</button>
            </li>
          ))}
        </ul>
        <form
          className="comment-form"
          onSubmit={function (e) {
            e.preventDefault()
            const comment = e.target.comment.value
            props.createComentOnServer(props.image.id, comment)
            e.target.reset()
          }}
        >
          <input
            className="comment-input"
            type="text"
            name="comment"
            placeholder="Add a comment..."
            required
          />
          <button className="comment-button" type="submit">Post</button>
        </form>
      </article>
    )
}

export default Image