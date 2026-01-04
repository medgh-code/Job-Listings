const jobList = document.querySelector(".jobList")
const tags = document.querySelector(".tags")
const clearBtn = document.querySelector(".clearBtn")
const filterBar = document.querySelector(".filterBar")
const deleteTag = document.querySelectorAll(".deleteTag")
function filterJobs(){
    let role = null
    let level = null
    let languages = []
    let tools = []
    const tagItems = [...tags.children]
    if(tagItems.length > 0){
        tagItems.forEach(element=>{
            const h2 = element.querySelector("h2")
            if(h2.classList.contains("role")){
                role = h2.textContent
            }else if(h2.classList.contains("level")){
                level = h2.textContent
            }else if(h2.classList.contains("language")){
                languages.push(h2.textContent)
            }else if(h2.classList.contains("tool")){
                tools.push(h2.textContent)
            }
        })
    }
    jobList.innerHTML = ""
    renderJobs(role,level,languages,tools)
}

function checkFilter(){
    if(tags.children.length !== 0){
        filterBar.classList.remove("hidden")
    }else{
        filterBar.classList.add("hidden")
    }
}

async function renderJobs(role,level,languages=[],tools=[]){
    const data = await fetch("./data.json")
    const response = await data.json();
    
      const filteredJobs = response.filter(job=>{
        if(role && job.role !== role) return false
        if(level && job.level !== level) return false
        if(languages.length && !languages.every(lang => job.languages.includes(lang))) return false
        if(tools.length && !tools.every(tool=> job.tools.includes(tool))) return false
        return true
    })
    for(let i = 0 ; i<filteredJobs?.length ; i++){
        let div = document.createElement("div")
        div.classList.add("listItem")
        if(filteredJobs[i].new && filteredJobs[i].featured){
            div.style.borderLeft = "4px solid hsl(180, 29%, 50%)"
        }
        div.innerHTML = `
         <div class="jobInfo">
                 <img src="${filteredJobs[i].logo}" alt="">
                 <div class="infoContainer">
                   <div class="companyName"><span class="name">${filteredJobs[i].company}</span>${filteredJobs[i].new ? '<span class="new">NEW!</span>' : '<span class="new hidden">NEW!</span>'}${filteredJobs[i].featured ? '<span class="featured">FEATURED</span>' : '<span class="featured hidden">FEATURED</span>'}</div>
                   <h2 class="position">${filteredJobs[i].position}</h2>
                   <div class="requirements"><span>${filteredJobs[i].postedAt}</span>&nbsp;.&nbsp;<span>${filteredJobs[i].contract}</span>&nbsp;.&nbsp;<span>${filteredJobs[i].location}</span></div>
                 </div>
             </div>
             <div class="technologies">
                  ${filteredJobs[i].role ?`<div class="technologie role">${filteredJobs[i].role}</div>` : ""}
                  ${filteredJobs[i].level ? `<div class="technologie level">${filteredJobs[i].level}</div>` : ""}
               ${filteredJobs[i].languages ? filteredJobs[i].languages.map(element=>{return `<div class="technologie language">${element}</div>`}).join(''): ""}
               ${filteredJobs[i].tools? filteredJobs[i].tools.map(element => `<div class="technologie tool">${element}</div>`).join('') : ''}
             </div>`
        jobList.append(div)
    }
}

document.addEventListener("click",function(e){
    if(e.target.classList.contains("technologie")){
        const tagItems = [...tags.children]
            let existingItem = false
            for(let i=0 ; i<tagItems.length;i++){
             const h2 = tagItems[i].querySelector("h2")
               if(h2.textContent === e.target.textContent){
                existingItem = true
            }
           } 
           if(existingItem === false){
             const div = document.createElement("div")
                div.classList.add("tagItem")
                div.innerHTML = `<h2 class="${e.target.className.split(" ")[1]}">${e.target.textContent}</h2>
              <i class="fa-solid fa-xmark deleteTag"></i>`
                tags.append(div)
           }
     checkFilter()
     filterJobs()
}})

clearBtn.addEventListener("click",function(){
    while(tags.firstChild){
        tags.removeChild(tags.firstChild)
    }
    checkFilter()
    filterJobs()
})

document.addEventListener("click",function(e){
    if(e.target.classList.contains("deleteTag")){
        e.target.parentElement.remove()
        checkFilter()
        filterJobs()
    }
})
renderJobs()
filterJobs()