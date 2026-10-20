const cl = console.log;

const createForm = document.getElementById('createForm');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const userIdControl = document.getElementById('userId');
const spinner = document.getElementById('spinner');
const blogContainer = document.getElementById('blogContainer');
const updateBlogBtn = document.getElementById('updateBlogBtn');


const addBlogBtn = document.getElementById('addBlogBtn');

const Base_Url = `https://studentpost-5eee3-default-rtdb.asia-southeast1.firebasedatabase.app`
const Blog_Url = `${Base_Url}/blog.json`;

const state = {
    blogsArr: [],
    editId: null
}



function showSpinner() {
    spinner.classList.remove('d-none')
}

function hideSpinner() {
    spinner.classList.add('d-none')
}

function snackBar(msg, icon) {
    swal.fire({
        title: msg,
        icon: icon,
        timer: 2500
    })
}
function ObjtoArr(obj) {
    for (const key in obj) {
        obj[key].id = key,
            state.blogsArr.unshift(obj[key])
    }
}


function createBlogCards(arr) {
    let result = ``
    arr.forEach(blog => {
        result += `
        <div class="col-md-4 mt-5" id=${blog.id}>
                <div class="card h-100">
                    <div class="card-header">
                        <h4 class="m-0">${blog.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${blog.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button onClick ="onRemove(this)" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                </div>
    
        </div>
            `
        blogContainer.innerHTML = result;
    });
}


// // showSpinner()
function fetchBlog() {
    fetch(Blog_Url, {
        method: 'GET',
        body: null,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token JWT"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            // cl(data)
            ObjtoArr(data)
            // cl(data)
            createBlogCards(state.blogsArr)
            // hideSpinner()
        })
        .catch(err => {
            cl(err)
            //         // hideSpinner()
        })

}

fetchBlog()

function onBlogAdd(eve) {
    eve.preventDefault()
    let new_Blog = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value
    }
    // cl(new_Blog)
    showSpinner()
    fetch(Blog_Url, {
        method: "POST",
        body: JSON.stringify(new_Blog),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token JWT From LS"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            // cl(data)
            new_Blog.id = data.name
            createForm.reset()
            state.blogsArr.unshift(new_Blog);
            let col = document.createElement('div');
            col.className = 'col-md-4 mt-5'
            col.id = new_Blog.id
            col.innerHTML = `
        
                 <div class="card h-100">
                    <div class="card-header">
                        <h4 class="m-0">${new_Blog.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${new_Blog.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button onClick ="onRemove(this)" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                </div>
        
        
       `
            blogContainer.prepend(col)
            snackBar(`The blog is added successfully !!!`,'success')

        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })


}

function onEdit(ele) {
    let Edit_Id = ele.closest('.col-md-4').id;
    state.editId = Edit_Id;
    // cl(Edit_Id);
    let Edit_Url = `${Base_Url}/blog/${Edit_Id}.json`
    // cl(Edit_Url)
    showSpinner()
    fetch(Edit_Url, {
        method: "GET",
        body: null,
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token JWT From LS"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(res => {
            // cl(data)
            titleControl.value = res.title;
            userIdControl.value = res.userId;
            contentControl.value = res.content;
            addBlogBtn.classList.add('d-none');
            updateBlogBtn.classList.remove('d-none');


        })
        .catch(err => {
            cl(err)
        })
        .finally(() => {
            hideSpinner()
        })

}


// function onEdit(ele){
//     let Edit_Id = ele.closest('.col-md-4').id;
//     state.editId= Edit_Id
//     let Edit_Obj = state.blogsArr.find(b => b.id === Edit_Id);
//     titleControl.value = Edit_Obj.title;
//     contentControl.value = Edit_Obj.content;
//     userIdControl.value = Edit_Obj.userId;

//     addBlogBtn.classList.add('d-none');
//     updateBlogBtn.classList.remove('d-none');


// }

function onBlogUpdate() {
    let Update_Id = state.editId;
    // cl(Update_Id)
    let Update_Url = `${Base_Url}/blog/${Update_Id}.json`
    let Updated_Obj = {
        title: titleControl.value,
        content: contentControl.value,
        userId: userIdControl.value,
        id: Update_Id
    }
    // cl(Updated_Obj)
    showSpinner()
    fetch(Update_Url, {
        method: "PATCH",
        body: JSON.stringify(Updated_Obj),
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Token JWT From LS"
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            // cl(data) js object
            let getIndex = state.blogsArr.findIndex(b => b.id === Update_Id)
            state.blogsArr[getIndex] = data // Updated_obj

            let col = document.getElementById(Update_Id)

            col.innerHTML = `
                        <div class="card h-100">
                    <div class="card-header">
                        <h4 class="m-0">${data.title}</h4>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${data.content}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onClick ="onEdit(this)" class="btn btn-primary btn-sm">Edit</button>
                        <button onClick ="onRemove(this)" class="btn btn-danger btn-sm">Remove</button>
                    </div>
                </div>
        
        
        
            `
            createForm.reset()
            snackBar(`The blog with id: ${Update_Id} is updated successfully`, 'success')
            updateBlogBtn.classList.add('d-none')
            addBlogBtn.classList.remove('d-none')

        })
        .catch(err =>
            cl(err)
        )
        .finally(() => {
            hideSpinner()
        })
}

// function onRemove(ele){
//     let Remove_Id = ele.closest('.col-md-4').id;
//     // cl(Remove_Id)

//     let Remove_Obj = state.blogsArr.findIndex(b => b.id === Remove_Id)
//     state.blogsArr.splice(Remove_Obj, 1 )

//     ele.closest('.col-md-4').remove()
// }


function onRemove(ele) {
    let Remove_Id = ele.closest('.col-md-4').id;
    // cl(Remove_Id)
    Swal.fire({
        title: `Are you sure, you want to remove the blog with id ${Remove_Id}?`,
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, rempve it!"
    }).then((result) => {
        showSpinner()
        if (result.isConfirmed){
            let Remove_Url = `${Base_Url}/blog/${Remove_Id}.json`
    // cl(Remove_Url)
    fetch(Remove_Url , {
        method : "DELETE",
        body : null,
        headers : {
                 "Content-Type" : "application/json",
                "Authorization" : "Token JWT From LS"
        }
       
    })
    .then(res => {
        if(!res.ok){
            throw new Error(`error..`)
        }
        return res.json()
    })
    .then(res => {
        // cl(res)

        //remove from array
        let getIndex = state.blogsArr.findIndex(b =>b.id === Remove_Id)
        state.blogsArr.splice(getIndex ,1)

       // remove card from ui
        ele.closest('.col-md-4').remove()

        snackBar(`The blog with id: ${Remove_Id} is removed successfully !!!`,'success')
    })
    .catch(err => {
        cl(err)
    })
    .finally(() =>{
        hideSpinner()
    })
        }else{
            hideSpinner()
        }
    });
}

updateBlogBtn.addEventListener('click', onBlogUpdate)
createForm.addEventListener('submit', onBlogAdd)




