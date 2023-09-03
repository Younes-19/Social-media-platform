// const { default: axios } = require("axios");
let cureentPage = 1
let lastPage = 1

window.addEventListener("scroll", function(){
  const endOfPage = this.window.innerHeight + this.window.pageYOffset >= this.document.body.scrollHeight;
  
  if(endOfPage && cureentPage < lastPage){
    cureentPage++
    getPosts(false,cureentPage)
    
  }
}) 



setUI()
getPosts()
 
getUser()
getUserPosts()


function getPosts(reload = true ,page=1){
  toggleLeloder(true)
  axios
  .get(`https://tarmeezacademy.com/api/v1/posts?limt=2&page=${page}`)
  .then((Response) => {
    toggleLeloder(false)
    const posts = Response.data.data;

    lastPage = Response.data.meta.last_page
    if(reload){
      document.getElementById("posts").innerHTML = " "; 
    }
    
    for (post of posts) {
      console.log(post);
      var postTitel = "";
      if (post.title != null) {
        postTitel = post.title;
      }

      // show or hide (edit) button
      let user = getCurrentUser()
      let isMyPost = user !=null && post.author.id == user.id
      let editButContent = ""
      if(isMyPost){
        editButContent = ` 
        <button class="btn btn-danger" style="float: right; margin-left:5px" onclick="deletPostBtn('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
        <button class="btn btn-secondary" style="float: right" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
        `
      }

      let content = `
            <div class="card shadow my-3">
              <div class="card-header">
                <span onclick="userClicked(${post.author.id})" style="cursor: pointer;">
                  <img src="${post.author.profile_image}"  alt="" class="rounded-circle border border-3 border-white" style="width: 40px; height: 40px;">
                  <b>@${post.author.name}</b>
                </span>


                ${editButContent}
                
              </>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                    <img class="w-100" src="${post.image}" alt="">
                    <h6 class="mt-1" style=" color: gray;">
                        ${post.created_at}
                    </h6>
                    <h5>
                        ${postTitel}
                    </h5>
                    <p>
                    
                        ${post.body}
                    </p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>
                            (${post.comments_count}) Comments
                        </span>

                        <span id="post-tags-${post.id}">
                        ${post.tags}
                        
                        </span>

                    </div>
                </div>
             </div>

     `;
      document.getElementById("posts").innerHTML += content;

      // const currentPost = `post-tags-${post.id}`
      // document.getElementById(currentPost).innerHTML = ""
      // for(tag of post.tags){
      //   console.log( tag.name)
      //   let tagscontent = `
      //   <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;"> ${tag.name} </button>
      //   `
      //   document.getElementById(currentPost ).innerHTML += tagscontent
       
      // }
    }
  });


}

function loginBtn() {
  // showSuccessAlert()
  const userName = document.getElementById("UsernameInput").value;
  const password = document.getElementById("passwordInput").value;

  const params = {
    username: userName,
    password: password,
  };

  toggleLeloder(true)
  axios
    .post("https://tarmeezacademy.com/api/v1/login", params)
    .then((Response) => {
      toggleLeloder(false)
      localStorage.setItem("token", Response.data.token);
      localStorage.setItem("user", JSON.stringify(Response.data.user));

      // closc the modal login
      const modal = document.getElementById("login-Modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("Loge in successfully","success")
      setUI()
    }).catch((ereor)=>{

      const message = ereor.Response.data.message
      showAlert(message,"danger")
    }).finally(()=>{
      toggleLeloder(false)
    });
  //console.log(userName,password)
}

function RegisterBtn(){
  const Name = document.getElementById("Register-name-Input").value;
  const userName = document.getElementById("Register-username-Input").value;
  const password = document.getElementById("Register-password-input").value;
  const Image = document.getElementById("Register-image-Input").files[0];

  let formData = new FormData()
  formData.append("name",Name)
  formData.append("username",userName)
  formData.append("password",password)
  formData.append("image",Image)

  // const params = {
  //   username: userName,
  //   password: password,
  //   name:Name
  // };

  const headers={
    "Content-Type":"multipart/form-data",
  }
    toggleLeloder(true)
  axios
    .post("https://tarmeezacademy.com/api/v1/register", formData ,{
      headers:headers
    })
    .then((Response) => {
      console.log(Response)


      localStorage.setItem("token", Response.data.token);
      localStorage.setItem("user", JSON.stringify(Response.data.user));

      // closc the modal login
      const modal = document.getElementById("Register-Modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();

      showAlert("New User  successfully","success")
      setUI()
    }).catch((error)=>{
      const message = error.response.data.message
      showAlert(message,"danger")
      // console.log(error);
    }).finally(()=>{
      toggleLeloder(false)
    })
}
function logout(){
  localStorage.removeItem("token")
  localStorage.removeItem("user")
  showAlert("Logout successfully","success")
  setUI()
  
}

function CreateNewPost(){
  let postId = document.getElementById("post-id-input").value
  
  let isCreate = postId == null || postId == ""

  const title = document.getElementById("post-titel-Input").value;
  const body = document.getElementById("post-body-Input").value;
  const Imge = document.getElementById("post-image-Input").files[0]

  const token = localStorage.getItem("token")

  let formData = new FormData()
  formData.append("body", body)
  formData.append("title", title)
  formData.append("image", Imge)
  // const headers={
  //   "Content-Type":"multipart/form-data",
  //   "authorization":`Bearer ${token}`
  // }

  // let url
 if(isCreate){
  //  url = "https://tarmeezacademy.com/api/v1/posts"
  toggleLeloder(true)
   axios.post("https://tarmeezacademy.com/api/v1/posts", formData , {
    headers:{
      "Content-Type":"multipart/form-data",
      "authorization":`Bearer ${token}`
    }
  })
  .then((Response) => {
    //  close the model
    const modal = document.getElementById("create-post-Modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    showAlert("New Post Has Been Created","success")
    getPosts()
    getUserPosts()

  }).catch((error)=>{
    const message = error.response.data.message
    showAlert(message,"danger")
    // console.log(error);
  }).finally(()=>{
    toggleLeloder(false)
  })
 }
 else{
  // url = `https://tarmeezacademy.com/api/v1/posts/${postId}`
  formData.append("_method","put")
  axios.post(`https://tarmeezacademy.com/api/v1/posts/${postId}`, formData , {
    headers:{
      "Content-Type":"multipart/form-data",
      "authorization":`Bearer ${token}`
    }   
  })
  .then((Response) => {
    //  close the model
    const modal = document.getElementById("create-post-Modal");
    const modalInstance = bootstrap.Modal.getInstance(modal);
    modalInstance.hide();

    showAlert("New Post Has Been Created","success")
    getPosts()
    getUserPosts()

  }).catch((error)=>{
    const message = error.response.data.message
    showAlert(message,"danger")
    // console.log(error);
  })
 }

}

function showAlert(customMessage,type) {
  const alertPlaceholder = document.getElementById("success-alert");
  const alert = (message, type) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
      `<div class="alert alert-${type} alert-dismissible" role="alert">`,
      `   <div>${message}</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      "</div>",
    ].join("");

    alertPlaceholder.append(wrapper);
  };
    alert(customMessage, type); 

    setTimeout(()=>{
      // const alerttohide = bootstrap.Alert.getOrCreateInstance('#success-alert')
      // alerttohide.close()

      const alert = document.getElementById("success-alert");
      const modalAlert = bootstrap.Modal.getInstance(alert);
      modalAlert.hide();
    },4000)

}

function setUI(){
  const token = localStorage.getItem("token")

  const logindiv = document.getElementById("logged-in-div")
  const logoutdiv = document.getElementById("logout-div")

  const addBtn = document.getElementById("add-btn")

  if(token == null){
    logindiv.style.setProperty("display","flex","important")
    logoutdiv.style.setProperty("display","none","important")

    if(addBtn != null){
      addBtn.style.setProperty("display","none","important")
    }
    
  }
  else{ 
    // for logged user
    logindiv.style.setProperty("display","none","important")
    logoutdiv.style.setProperty("display","flex","important")
    if(addBtn != null){
      addBtn.style.setProperty("display","flex","important")
    }
    

    const user = getCurrentUser()
    document.getElementById("nav-username").innerHTML = user.username

    document.getElementById("nav-userimage").src = user.profile_image
    
  }
}

function getCurrentUser(){
  let user = null
  const storagUser = localStorage.getItem("user")
  if(storagUser != null){
    user = JSON.parse(storagUser)
  }
  return user

}

function postClicked(postId){
  // alert(postId)
  window.location = `postDetail.html?postId=${postId}`
}

function editPostBtn(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)

  document.getElementById("post-modal-submit-btn").innerHTML = " Update"
  document.getElementById("post-id-input").value= post.id
  document.getElementById("Post-Modal-title").innerHTML="Edit Post"
  document.getElementById("post-titel-Input").value = post.title
  document.getElementById("post-body-Input").value = post.body
  
  let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
  postModal.toggle()
  setUI()
}

function deletPostBtn(postObject){
  let post = JSON.parse(decodeURIComponent(postObject))
  console.log(post)
  
  document.getElementById("delete-post-id-input").value = post.id
  let postModal = new bootstrap.Modal(document.getElementById("delete-post-Modal"),{})
  postModal.toggle()
  setUI()
}

function confirmPostDelete(){
  const postId = document.getElementById("delete-post-id-input").value
  const token = localStorage.getItem("token")
  axios
  .delete(`https://tarmeezacademy.com/api/v1/posts/${postId}`,{
    headers:{
      "Content-Type":"multipart/form-data",
      "authorization":`Bearer ${token}`
    } 
  })
    .then((Response) => {
      const modal = document.getElementById("delete-post-Modal");
      const modalInstance = bootstrap.Modal.getInstance(modal);
      modalInstance.hide();
  
      showAlert("The Post Has Been Deleted Successfully","success")
      getPosts()
      getUserPosts()
    }).catch((error)=>{
      const message = error.response.data.message
      showAlert(message,"danger")
    })

}


function addBtnClicked(){
  document.getElementById("post-modal-submit-btn").innerHTML = " Create"
  document.getElementById("post-id-input").value= ""
  document.getElementById("Post-Modal-title").innerHTML="Create New Post"
  document.getElementById("post-titel-Input").value = ""
  document.getElementById("post-body-Input").value = ""
  
  let postModal = new bootstrap.Modal(document.getElementById("create-post-Modal"),{})
  postModal.toggle()

}


// profile script
getUser()
getUserPosts()
setUI()

function get_Current_User(){
  const urlParams = new URLSearchParams(window.location.search)
  const id = urlParams.get("userid")
  return id
}
function getUser(){
  const id = get_Current_User()

  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
  .then((Response) => {
    console.log(Response.data)
    const user = Response.data.data
    document.getElementById("header-imge").src = user.profile_image
    document.getElementById("main-info-email").innerText = user.email
    document.getElementById("main-info-name").innerText = user.name
    document.getElementById("main-info-username").innerText = user.username
    document.getElementById("posts-count").innerText = user.posts_count
    document.getElementById("comments-count").innerText = user.comments_count

    document.getElementById("name-posts").innerText = `${user.username}'s`
   })
   setUI()
}

function getUserPosts(){
  const id = get_Current_User()

  axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
  .then((Response) => {
    const posts = Response.data.data
    document.getElementById("user-post").innerHTML = ""
    for (post of posts) {

      var postTitel = "";
      if (post.title != null) {
        postTitel = post.title;
      }

      // show or hide (edit) button
      let user = getCurrentUser()
      let isMyPost = user !=null && post.author.id == user.id
      let editButContent = ""
      if(isMyPost){
        editButContent = ` 
        <button class="btn btn-danger" style="float: right; margin-left:5px" onclick="deletPostBtn('${encodeURIComponent(JSON.stringify(post))}')">delete</button>
        <button class="btn btn-secondary" style="float: right" onclick="editPostBtn('${encodeURIComponent(JSON.stringify(post))}')">edit</button>
        `
      }

      let content = `
            <div class="card shadow my-3">
              <div class="card-header">
                <img src="${post.author.profile_image}"  alt="" class="rounded-circle border border-3 border-white" style="width: 40px; height: 40px;">
                <b>@${post.author.username}</b>
                ${editButContent}
                
              </div>
                <div class="card-body" onclick="postClicked(${post.id})" style="cursor: pointer;">
                    <img class="w-100" src="${post.image}" alt="">
                    <h6 class="mt-1" style=" color: gray;">
                        ${post.created_at}
                    </h6>
                    <h5>
                        ${postTitel}
                    </h5>
                    <p>
                    
                        ${post.body}
                    </p>
                    <hr>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                        </svg>
                        <span>
                            (${post.comments_count}) Comments
                        </span>

                        <span id="post-tags-${post.id}">
                        ${post.tags}
                        
                        </span>

                    </div>
                </div>
             </div>

     `;
      document.getElementById("user-post").innerHTML += content;

      // const currentPost = `post-tags-${post.id}`
      // document.getElementById(currentPost).innerHTML = ""
      // for(tag of post.tags){
      //   console.log( tag.name)
      //   let tagscontent = `
      //   <button class="btn btn-sm rounded-5" style="background-color: gray; color: white;"> ${tag.name} </button>
      //   `
      //   document.getElementById(currentPost ).innerHTML += tagscontent
       
      // }
    }
  });
}

function userClicked(userId){
    // alert(userId)
    window.location=`profile.html?userid=${userId}`
}

function profileClicked(){
  const user = getCurrentUser()
  const userId = user.id
  window.location=`profile.html?userid=${userId}`
}


function toggleLeloder(show=true){
  if(show){
    document.getElementById("loader").style.visibility = 'visible'
  }else{
    document.getElementById("loader").style.visibility = 'hidden'
  }

}

