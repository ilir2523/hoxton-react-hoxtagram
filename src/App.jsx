import { useEffect, useState } from 'react'
import './App.css'

function App() {

  const [images, setImages] = useState([])

  function getImages() {
    return fetch("http://localhost:3000/images")
      .then((resp) => resp.json())
  }

  useEffect(function () {
    getImages().then((imagesFromServer) => setImages(imagesFromServer))
  }, [])

  function addLike(image) {
    fetch(`http://localhost:3000/images/${image.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        likes: image.likes + 1
      })
    })
    const updatedLikes = [...images]
    setImages(updatedLikes)
  }

  function createComentOnServer(imageId, content, image) {
    fetch('http://localhost:3000/comments', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        imageId: imageId,
        content: content
      })
    }).then(resp => resp.json())
  }

    function deleteComments(comment) {
      return fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: 'DELETE'
      }).then(resp => resp.json())
      .then(function () {
        const updateComments = comment.filter((targetComment) => targetComment.id !== comment.id)
        setImages(updateComments)
      })
  }

  return (
    <div className="body">
      <img className="logo" src='./src/assets/hoxtagram-logo.png' />
      <section className="new-image-container">

      </section>
      <section className="image-container">

        <form className="comment-form image-card">
          <h2 className="title">New Post</h2>
          <input
            className="comment-input"
            type="text"
            name="title"
            id="title"
            placeholder="Add a title..."
          />
          <input
            className="comment-input"
            type="url"
            name="image"
            id="image"
            placeholder="Add an image url..."
          />
          <button className="comment-button" type="submit">Post</button>
        </form>

        {images.map((image) => (
          <article className="image-card" key={image.id} >
            <h2 className="title">{image.title}</h2>
            <img src={`${image.image}`} className={`${image.title}`} />
            <div className="likes-section">
              <span className="likes">{`${image.likes} likes`}</span>
              <button className="like-button" onClick={() => {
                addLike(image)
                image.likes += 1
              }}>♥</button>
            </div>
            <ul className="comments">
              {image.comments.map((comment) => (
                <li key={comment.id}>{`${comment.content}`}
                  <button
                    className='delet-coment-btn'
                    onClick={
                      function () {
                        deleteComments(comment)

                        // image.comments = image.comments.filter(function (targetComment) {
                        //   return targetComment.id !== comment.id
                        // })
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
                createComentOnServer(image.id, comment, image)
                const commentForm = document.querySelector('article form.comment-form')
                commentForm.reset()
              }}
            >
              <input
                className="comment-input"
                type="text"
                name="comment"
                placeholder="Add a comment..."
              />
              <button className="comment-button" type="submit">Post</button>
            </form>
          </article>
        ))}
      </section>
    </div>
  )
}

export default App
