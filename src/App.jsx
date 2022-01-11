import { useEffect, useState } from 'react'
import './App.css'
import Image from './components/Image'

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
    const updatedLikes = JSON.parse(JSON.stringify(images))
    const match = updatedLikes.find((targetImage) => targetImage.id === image.id)
    match.likes++
    setImages(updatedLikes)
  }

  function createComentOnServer(imageId, content) {
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
      .then((newComment) => {
        const updatedImages = JSON.parse(JSON.stringify(images))
        const match = updatedImages.find((targetImage) => targetImage.id === imageId)
        match.comments.push(newComment)
        setImages(updatedImages)
      })
  }

  function deleteComments(comment) {
    fetch(`http://localhost:3000/comments/${comment.id}`, {
      method: 'DELETE'
    }).then(resp => resp.json())
      .then(() => {
        const updatedImages = JSON.parse(JSON.stringify(images))
        const match = updatedImages.find((targetImage) => targetImage.id === comment.imageId)
        match.comments = match.comments.filter(targetComment => targetComment.id !== comment.id)
        setImages(updatedImages)
      })

  }

  function createImageOnServer(title, imageUrl) {
    fetch('http://localhost:3000/images', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        likes: 0,
        image: imageUrl,
        comments: []
      })
    }).then(resp => resp.json())
      .then((newImage) => {
        const copyImages = JSON.parse(JSON.stringify(images))
        copyImages.push(newImage)
        setImages(copyImages)
      })
  }

  function deleteImage(id) {
    fetch(`http://localhost:3000/images/${id}`, {
      method: 'DELETE'
    }).then(resp => resp.json())
    .then(() => {
      const copyImages = JSON.parse(JSON.stringify(images))
      const updatedImages = copyImages.filter((target) => target.id !== id)
      setImages(updatedImages)
    })
  }

  return (
    <div className="body">
      <img className="logo" src='./src/assets/hoxtagram-logo.png' />
      <section className="new-image-container">

      </section>
      <section className="image-container">

        <form className="comment-form image-card"
          onSubmit={(e) => {
            e.preventDefault()
            const titleValue = e.target.title.value
            const imageValue = e.target.image.value

            createImageOnServer(titleValue, imageValue)
            e.target.reset()
          }
          }
        >
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
          <Image image={image} key={image.id}
            addLike={addLike}
            createComentOnServer={createComentOnServer}
            deleteComments={deleteComments}  
            deleteImage={deleteImage}/>
        ))}
      </section>
    </div>
  )
}

export default App
