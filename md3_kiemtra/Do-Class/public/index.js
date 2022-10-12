let todoList = document.getElementById("todo-list");
let form = document.getElementById("form");
let btn = document.getElementById("todo-form__btn")


form.onsubmit = function(e) {
    e.preventDefault();
    // console.log("Hello world")
    let input = form.input.value
    console.log(input);
    
}







// fetch("/api/v1/todos")
//     .then(function(response) {
//         return response.json()
//     })
//     .then(function(data){
//         console.log(data);

//     })
//     .catch(function(err) {
//         alert(err)
//     })