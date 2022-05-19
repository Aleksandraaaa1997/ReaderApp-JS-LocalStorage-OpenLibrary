// ******** Home Section - Auto Text Effect ********
const textEl = document.getElementById('title');
const text = 'The Reader';
let index = 1;

function writeText() {
    textEl.innerHTML = text.slice(0, index);
    index++;
    //I can test and see if the index is greater than the text.length.If that is true, then I am going to reset the index to one. So it will start over
    if (index > text.length) {
        index = 1;
    }
    setTimeout(writeText, 250)
}

writeText();
// ******** End of Home Sectio-Auto Text Effect ********

//********* Popular Section-Carousel Functionality ********
const imgs = document.getElementById('imgs');
const leftBtn = document.getElementById('left');
const rightBtn = document.getElementById('right');

// length of img array is 4
const img = document.querySelectorAll('#imgs img');

let idx = 0;

let interval = setInterval(run, 2000);

function run() {
    idx++;
    changeImage();
}

function changeImage() {
    // if we are at the end then of array we will have to reset the index
    if (idx > img.length - 1) {
        idx = 0;
    }
    // We are translate image-container with images for -32rem,-64rem ect
    imgs.style.transform = 'translateX(-' + idx * 32 + "rem)";
}

// function resetInterval with JS function clearInterval clearing the current interval, and then reset it
function resetInterval() {
    clearInterval(interval);
    interval = setInterval(run, 2000);
}

// Event Listener 
rightBtn.addEventListener('click', () => {
    idx++;
    changeImage();
    resetInterval();
})
leftBtn.addEventListener('click', () => {
    idx--;
    changeImage();
    resetInterval();
})

//******** End of Popular Section-Carousel Functionality ********

//******** Search Book Section-search books ********
let searchBtn = document.getElementById('search-btn');
let output = document.getElementById('output');
let input = document.getElementById('input');

function getBooks(event) {
    event.preventDefault();
    // output.innerHTML = "";
    output.innerHTML = "loading ..."
    //It will clear output div. If we want to search for something and then want to search for something else the old result be cleared before getting new result
    //If the input value is empty and someone clicks the search button, an alert will be display
    //trim removes whitespace from both sides of a input value
    if (input.value.trim()) {
        fetch("http://openlibrary.org/search.json?q=" + input.value)
            //after fetch this is string, now we must to convert in dictionary/object which we can then read
            .then(response => response.json())
            .then(data => {
                //If someone tries to search for a book that is non-existent, then response.docs.length is 0
                if (data.docs.length == 0) {
                    output.innerHTML = "<p>There are no search results. Try again!</p>"
                }
                else {
                    //if we want to show all of the results then we will use for loop for(var i=0;i<response.docs.lenth;i++) 
                    //I put authore_name[0] because if there are multiple author for some book this will show whoever is first on the list
                    //If we are wanted the image to be big and high resolution then "-L.jpg", if we want medium "-M.jpg" and if we want small "-S.jpg"
                    output.innerHTML = "<div class='container-fluid'><div class='row'><div class='col-6'><h2>" + data.docs[0].title + "</h2>" + data.docs[0].author_name[0] + "<br><b>Publisher year:</b> " + data.docs[0].publish_year[0] + "<br><b>Publisher facet:</b> " + data.docs[0].publisher_facet[0] + "<br><br><img src='http://covers.openlibrary.org/b/isbn/" + data.docs[0].isbn[0] + "-M.jpg'><br></div><div class='col-6'><h2>" + data.docs[1].title + "</h2>" + data.docs[1].author_name[0] + "<br><b>Publisher year:</b> " + data.docs[1].publish_year[0] + "<br><b>Publisher facet:</b> " + data.docs[1].publisher_facet[0] + "<br><br><img src='http://covers.openlibrary.org/b/isbn/" + data.docs[1].isbn[0] + "-M.jpg'></div></div></div>"
                }
            });
        // Clear input value
        input.value = '';
    }
    else {
        alert('Please enter a search term');
    }
}

//Event Listener
searchBtn.addEventListener('click', getBooks);
//******** End of Search Book Section-search books ********

//******** Wish Book Section ********
// Book Class-every time when we create a book it is going to instantiate a book object
class Book {
    constructor(title, author, key) {
        this.title = title;
        this.author = author;
        this.key = key;
    }
}

// ShowRemove Class- when a book display in the list or removes or we show alert
class ShowRemove {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => ShowRemove.addBookToList(book));
    }
    static addBookToList(book) {
        //this function creates the row to put into tbody in the table
        const list = document.getElementById('book-list');
        const row = document.createElement('tr');
        row.innerHTML = "<td>" + book.title + "</td><td>" + book.author + "</td><td>" + book.key + "</td><td><a href='#wish-list' class='btn btn-danger btn-sm delete'>X</a></td>";
        list.appendChild(row);
    }
    static deleteBook(element) {
        //We want when to click the delete button to delete the element. Button for delete has class="delete"
        if (element.classList.contains('delete')) {
            //parentElement is <td>, parentElement.parentElement is row
            element.parentElement.parentElement.remove();
        }
    }
    static clearFields() {
        //When we submitted something, want the value in input to disappear
        document.getElementById('input-title').value = '';
        document.getElementById('input-author').value = '';
        document.getElementById('input-key').value = '';
    }

}

// Store Class-local storage, it doesn't go away when we refresh the page or leave the site/close browser
class Store {
    //Can't store objects in local storage it has to be a string. Before we add it to local storage we have to stringify 
    static getBooks() {
        let books;
        //if there is no items of books
        if (localStorage.getItem('books') === null) {
            books = [];
        }
        else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);
        //LocalStorage is a string, books are array of objects so the solution is to wrap these books in JSON.stringify
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(key) {
        //remove by key
        const books = Store.getBooks();
        books.forEach((book, index) => {
            //we check if the key of the current book matches the one that is passed in for removing the book 
            if (book.key === key) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event-display book
//when DOM loads we want to call ShowRemove.displayBooks 
document.addEventListener('DOMContentLoaded', ShowRemove.displayBooks);

//Event add a book
document.getElementById('wish-list-btn').addEventListener('click', () => {
    // izbrisala sam event iz zagrade
    //This is submit an event, we need to prevent the default value
    // event.preventDefault();

    //Get form values
    const title = document.getElementById('input-title').value;
    const author = document.getElementById('input-author').value;
    const key = document.getElementById('input-key').value;

    //Validate
    if (title === '' || author === '' || key === '') {
        alert('Please fill in all fields');
    }
    else {
        //Instatiate book
        const book = new Book(title, author, key);

        // Add Book to ShowRemove
        ShowRemove.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        // Clear fields 
        ShowRemove.clearFields();
    }
});
//Event-Remove a Book
//when we have multiple delete links we can't add a click event, because it will only delete the first one. We need to use something called event propagation where we select something above it like a book list and then we target whatever is clicked inside of it
document.getElementById('book-list').addEventListener('click', (event) => {
    //Remove book from ShowRemove
    ShowRemove.deleteBook(event.target);

    //Remove book from store
    //parentElement is <td>
    Store.removeBook(event.target.parentElement.previousElementSibling.textContent);
})
//******** End of Wish Book Section ********

//******** My Books Section ********
const addBtn = document.getElementById('my-books-note-btn');
//this notebook is an array of one string member because we have one note 
const notes = JSON.parse(localStorage.getItem('notes'));

if (notes) {
    notes.forEach(note => addNewNote(note));
}
//Checkbox
const checkBtn = document.getElementById('checkbox');
const currentCheckStatus = localStorage.getItem('checked');

function check(event) {
    if (event.target.checked) {
        localStorage.setItem('checked', 'yes');
    }
    else {
        localStorage.setItem('checked', 'no');
    }
}

if (currentCheckStatus === 'yes') {
    checkBtn.checked = true;
}
else if (currentCheckStatus === 'no') {
    checkBtn.checked = false;
}
checkBtn.addEventListener('change', check);

//Event- Add Note
addBtn.addEventListener('click', () => {
    //We can add note only one time
    addBtn.disabled = true;
    addBtn.style.opacity = 0.2;
    addNewNote()
});

function addNewNote(text = '') {
    const note = document.createElement('div');
    note.classList.add('note')

    if (text) {
        note.innerHTML = "<div class='tools'></button><button class='delete'><i class='fas fa-trash-alt'></i></button></div><div class='hidden'></div><textarea>" + text + "</textarea>";
    }
    else {
        note.innerHTML = "<div class='tools'></button><button class='delete'><i class='fas fa-trash-alt'></i></button></div><div class='hidden'></div><textarea></textarea>";
        // addBtn.disabled=true;
    }

    const textArea = note.querySelector('textarea');
    //Event-Delete Note
    const deleteBtn = note.querySelector('.delete');
    deleteBtn.addEventListener('click', () => {
        addBtn.disabled = false;
        addBtn.style.opacity = 1;
        note.remove();
        updateLocalStorage();
    })

    //Textarea
    textArea.addEventListener('input', (event) => {
        // event.target.value;
        updateLocalStorage();
    })
    document.getElementById('note-wrapper').appendChild(note);

}
//LocalStorage
function updateLocalStorage() {
    const notesText = document.querySelectorAll('textarea');
    const notes = [];
    notesText.forEach(note => notes.push(note.value))
    localStorage.setItem('notes', JSON.stringify(notes))

}
//******** End of My Books Section ********

//******** Log-in/Sing in Section ********
const loginSingin = document.getElementById('login-singin');
//showHide is icon
showHide = document.querySelectorAll('.showHide');
passwordInputs = document.querySelectorAll('.password');
singUp = document.querySelector('.singup-link');
login = document.querySelector('.login-link')

//Show/Hide password and chage icon
showHide.forEach(eyeIcon => {
    eyeIcon.addEventListener("click", () => {
        passwordInputs.forEach(input => {
            if (input.type === "password") {
                input.type = "text";
                showHide.forEach(icon => {
                    icon.classList.replace("uil-eye-slash", "uil-eye")
                })
            }
            else {
                input.type = "password";
                showHide.forEach(icon => {
                    icon.classList.replace("uil-eye", "uil-eye-slash")
                })
            }
        })
    })
})
//Appear singup and login form
singUp.addEventListener('click', () => {
    loginSingin.classList.add('active');
})
login.addEventListener('click', () => {
    loginSingin.classList.remove('active')
})
//******** End of Log-in/Sing in Section ********



