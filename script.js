const maxBooks = 50;          
const maxCharacter = 10;      
const maxCharacterDisplay = 5;
let charactersObject = {}


let booksAPIUrl = 'https://www.anapioficeandfire.com/api/books?pagesize='+maxBooks;

async function getBooksDetails(){
    try {

        let response = await fetch(booksAPIUrl);
        let data = await response.json();

        let container = createElement("div","container");
        let row = createElement("div","row");
        row.setAttribute("id","row-id");
        container.append(row);
        document.body.append(container);
        
        document.getElementById("fetch-logo").classList.add("d-none");
        
        data.forEach(async element => {
            
            let releaseDate = new Date(element.released).toLocaleDateString();
            let id = element.name.split(" ").join("")
            
            document.getElementById("row-id").innerHTML += `
            <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="book text-center mx-auto" id="${id}">
                    <div class="book-card">
                        <h1 class="pb-3">${element.name}</h1>
                        <i>By</i><h5 class="pb-3">${element.authors.join(", ")}</h5>
                        <i>Published by</i><p>${element.publisher}</p>
                        <a class="char-button" onclick="flipCard(\'${id}\')">
                            Click to view Characters
                        </a>
                        <div class="row small pt-3 pb-2 mx-auto footer-card" id="${id}-footer">
                            <div class="footer-item col-6"><i>ISBN:</i></div>
                            <div class="footer-item col-3"><i>Released:</i></div>
                            <div class="footer-item col-3"><i>Pages:</i></div>
                            <div class="footer-item col-6">${element.isbn}</div>
                            <div class="footer-item col-3">${releaseDate}</div>
                            <div class="footer-item col-3">${element.numberOfPages}</div>
                        </div>
                    </div>
                    <div class="book-card card-back">
                    <i class="fa fa-arrow-left" onclick="flipCard(\'${id}\')"><b> back</b></i>
                    <span id="${id}-character-list"></span>
                    <i class="fa fa-spinner" id="${id}-card-fetch-logo">
                        <b> Fetching Data...</b>
                    </i>
                    </div>
                </div>
            </div>
            `;

            document.getElementById(id+"-character-list").innerHTML = '<h5><u>Character Names</u></h5>'

            if(element.characters.length !== 0){

                let characterData = await getCharacterDetails(element.characters,id)
                charactersObject[id] = characterData;
                document.getElementById(id+"-character-list").innerHTML += `<a class="view-more char-button" onclick="viewMore(\'${id}\')">View More</a>`
            }

            else{
                document.getElementById(id+"-character-list").innerHTML += '<i>Data not available</i>'
            }

            document.getElementById(id+'-card-fetch-logo').classList.add("d-none")
        });

    } catch (error) {
        console.log(error)
    }

}

/**
 * This function is used to get the character details from API and adds the character data in the
 * card. Max number of characters is controlled by the value of 'maxCharacter'
 * @param {Array} character Array of character API urls 
 * @param {String} id Id of the book card
 * @returns {Array} Array of objects containing character details
 */
async function getCharacterDetails(character, id){

    let characterData = [];

    try {
        for(let index = 0; index<character.length;index++){

            let response = await fetch(character[index]);
            let charData = await response.json();

            if(charData.name !== "" && characterData.length < maxCharacter && characterData.length < maxCharacterDisplay){
                document.getElementById(id+"-character-list").innerHTML += `<p>${charData.name}</p>`
                characterData.push(charData);
            }

            else if(charData.name !== "" && characterData.length < maxCharacter && characterData.length >= maxCharacterDisplay){
                characterData.push(charData);
            }

            else if(characterData.length >= maxCharacter){
                break;
            }
        }
        
    } catch (error) {
        console.log(error)
    }

    return characterData;
}

/**
 * This function is used to create a HTML tag and add the given classes to it.
 * @param {String} tagName Name of the HTML tag to be created
 * @param {String} classNameList Class names to be added to the tag.
 * @returns {object} The created HTML tag
 */
function createElement(tagName,classNameList = ""){
    var element = document.createElement(tagName);
    element.classList.add(classNameList);
    return element;
}

/**
 * This function is used to flip a book card of given id.
 * @param {String} id Id of the book card 
 */
function flipCard(id){
    document.getElementById(id+"-footer").classList.toggle("invisible")
    document.getElementById(id).classList.toggle("is-flipped");
}

/**
 * This function is used to handle onclick of 'view more' button under characters list.
 * It displays the details of characters upto maximum of 'maxCharacters'.
 * @param {String} id Id of the book card 
 */
function viewMore(id){
    data = charactersObject[id];
    document.getElementById("form-div").classList.remove("d-none")
    data.forEach(element => {
        document.getElementById("tbody").innerHTML += `
        <tr>
            <th scope="row">${element.name}</th>
            <td>${element.gender}</td>
            <td>${element.titles.join(", ")}</td>
            <td class="pr-4">${element.aliases.join(", ")}</td>
        </tr>
        `;
    });
}

function closeViewMore(){
    document.getElementById("form-div").classList.add("d-none");
    document.getElementById("tbody").innerHTML = "";

}

document.body.classList.add("bg-light");
document.body.innerHTML = `<h1 class="text-center text-white mt-5 font-weight-bolder header-font">Ice and Fire API</h1>
    <h3 class="text-white text-center"><i class="fa fa-spinner" id="fetch-logo"><b> Fetching Data...</b></i></h3>`

document.body.innerHTML += `
    <div class="row char-form d-none" id="form-div">
        <div class="form container text-center table-responsive"> 
            <div class="text-right close-button"><i class="fa fa-times fa-2x" onclick="closeViewMore()"></i></div>
            <table class="table table-bordered">
                <thead class="thead">
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Gender</th>
                        <th scope="col">Title</th>
                        <th scope="col">Aliases</th>
                    </tr>
                </thead>
                <tbody id="tbody" class="tbody"></tbody>
            </table>
        </div>
    </div>
`;

getBooksDetails() 