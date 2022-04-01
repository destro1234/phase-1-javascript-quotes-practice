let quoteList = document.querySelector('#quote-list')
let form = document.querySelector('#new-quote-form')
let sortButton = document.createElement('button')
sortButton.innerHTML = 'Sort: ON'

document.body.append(document.createElement('br'), sortButton)

fetch('http://localhost:3000/quotes?_embed=likes')
.then(res => res.json())
.then(function (quotes) {
    listQuotes(quotes)
    sortButton.addEventListener('click', function (e) {
        
        if (sortButton.innerHTML == 'Sort: OFF') {
            quoteList.innerHTML = " "
            sortButton.innerHTML = 'Sort: ON'
            sortQuotes()
        }
        else if (sortButton.innerHTML == 'Sort: ON') {
            quoteList.innerHTML = " "
            listQuotes(quotes)
            
            sortButton.innerHTML = 'Sort: OFF'
            
            
        }
    })
})

function listQuotes(quotes) {
    quotes.forEach(quote => {
        createOneQuote(quote)
    })

    
}

function createOneQuote(quote) {
    let li = document.createElement('li')
        li.innerHTML = `
            <li class='quote-card'>
            <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class='btn-success' id='edit' >Edit</button> 
            <button class='btn-success' id='like' >Likes: <span>0</span></button>
            <button class='btn-danger' id='delete'>Delete</button>
            </blockquote>
            </li>
    
    
    `
    renderLikes(quote, li)
    quoteList.append(li)

    let editButton = li.querySelector('#edit')
    let likeButton = li.querySelector('#like')
    let deleteButton = li.querySelector('#delete')

    

    editButton.addEventListener('click', function (e) {
        let editForm = document.createElement('form')
        editForm.id= 'edit-form'
        

        editForm.innerHTML = `
        <div class="form-group">
        <label for="edit-quote">Edit Quote</label>
        <input name="quote" type="text" class="form-control" id="edit-quote" placeholder="Learn. Love. Code.">
        </div>
        <div class="form-group">
        <label for="edit-author">Edit Author</label>
        <input name="author" type="text" class="form-control" id="edit-author" placeholder="Flatiron School">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>
        `
        li.append(editForm)

        

        editForm.addEventListener('submit', function (e) {
            let editQuote = editForm.querySelector("#edit-quote").value
            let editAuthor = editForm.querySelector('#edit-author').value
            editQuote ? quote.quote = editQuote : quote.quote = quote.quote
            editAuthor ? quote.author = editAuthor : quote.author = quote.author
            e.preventDefault()
            renderEdit(quote)
        })


    })

    likeButton.addEventListener('click', function () {
        handleLikes(quote.id)
    })

    form.addEventListener('submit', handleSubmit)


    deleteButton.addEventListener('click', function (e) {
        li.innerHTML = " ",
        handleDelete(quote.id)
    })
}

function addQuote(quote) {
    fetch(`http://localhost:3000/quotes`, {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(quote)
    })
}

function handleSubmit(e) {
    e.preventDefault()
    let quote = {}
    quote.quote = e.target.querySelector('#new-quote').value
    quote.author = e.target.querySelector('#author').value
    quote.likes = []
    createOneQuote(quote)
    addQuote(quote)
    
}

function handleDelete(id) {
       fetch(`http://localhost:3000/quotes/${id}`, {
       method: 'DELETE',
       headers: {
           "Content-Type" : "application.json"
       }
    })
    .then(res => res.json())
    .then(data => console.log(data))
    

}

function handleLikes(id) {
    console.log(id)
    fetch('http://localhost:3000/likes', {
        method:"POST",
        headers: {
            'Content-Type':"application/json"
        },
        body: JSON.stringify({
            quoteId: id,
            createdAt: Date()
        })
    })
}

function renderEdit(quote) {
    fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method:"PATCH",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(quote)
    }
    
    )
}

function renderLikes(quote, li) {
    fetch(`http://localhost:3000/likes?quoteId=${quote.id}`)
    .then(resp => resp.json())
    .then(function (data) {
        li.querySelector('#like').innerHTML =  `Likes: ${data.length} `
    })
}
 function sortQuotes() {
    
    
    fetch('http://localhost:3000/quotes?_sort=author')
     .then(res => res.json())
     .then(quotes => listQuotes(quotes))
    }



