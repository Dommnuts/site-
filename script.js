let tabStart = 2
let tabCount = tabStart;
let activeTabs = new Set([1, 2]);                                                       

document.addEventListener('DOMContentLoaded', () => {
  const tab1 = document.querySelector(`[data-tab="1"]`);
  const tab2 = document.querySelector(`[data-tab="2"]`);

  if (tab1) {
    attachTabClick(tab1, 1);
    enableTabRenaming(tab1);
  }

  if (tab2) {
    attachTabClick(tab2, 2);
    enableTabRenaming(tab2);
    
    const xButton = document.createElement("span");
    xButton.className="xbutton";
    xButton.textContent = "❌";
    xButton.onclick=(e)=> {
      e.stopPropagation();
      closeTab(2);
    }
    tab2.appendChild(xButton);
  }
  
  updateTabSelector();
});

document.getElementById("EnterButton").addEventListener("click", () => {
  let url = document.getElementById("InputId").value.trim();
  if (!url){
    alert("Please enter a URL.");
    return;
  }
  
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    url = "https://" + url;
  }
  
  const selectedTab = document.getElementById("tabSelect").value;
  const tabNumber = selectedTab.replace("tab", "").replace("content", "");

  document.getElementById(`Frame${tabNumber}`).src = `/proxy?url=${encodeURIComponent(url)}`;

  const targetButton = document.querySelector(`[data-tab="${tabNumber}"]`);
  if (targetButton) {
    targetButton.click();
  }
});

function opentab(tabNumber){
  const contents = document.querySelectorAll(".tab-content");
  contents.forEach((c) => c.classList.remove("activecontent")); 

  const buttons = document.querySelectorAll(".tabButtons button:not(.newtab)");
  buttons.forEach((b)=> {
    b.classList.remove("activetab");
    b.classList.add("notactivetab");
  });
  
  const content = document.getElementById(`tab${tabNumber}content`);
  const button = document.querySelector(`[data-tab="${tabNumber}"]`);
  
  if (!content || !button) return;

  content.classList.add("activecontent");
  button.classList.remove("notactivetab");
  button.classList.add("activetab");
}

function addNewTab() {
  tabCount++;
  activeTabs.add(tabCount);
  updateTabSelector();
  const tabButtons = document.getElementById("tabButtons");
  const NewTabButton = tabButtons.querySelector (".newtab");
  const tabContainer = document.querySelector(".tab");

  const button = document.createElement("button");
  button.className = "notactivetab";
  button.setAttribute("data-tab", tabCount);
  
  const label = document.createElement("span");
  label.className = "tab-label";
  label.textContent = `Tab ${tabCount}`;
  button.appendChild(label);
  enableTabRenaming(button);

  const xButton = document.createElement("span");
  xButton.className="xbutton";
  xButton.textContent = "❌";
  const currentTab = tabCount;

  xButton.onclick = (e) => {
    e.stopPropagation();
    closeTab(currentTab);
  } 
  
  button.appendChild(xButton);
  attachTabClick(button, currentTab);
  
  tabButtons.insertBefore(button, NewTabButton);

  const newTabContent = document.createElement("div");
  newTabContent.id = `tab${tabCount}content`;
  newTabContent.className = "tab-content notactivecontent";

  newTabContent.innerHTML=` 
    <h3>page the other one</h3>
    <p>proxy page :0</p>
    <iframe id="Frame${tabCount}"></iframe>
  `;
   
  tabContainer.appendChild(newTabContent);
}

function updateTabSelector() {
  const selector = document.getElementById("tabSelector");
  const select = document.getElementById("tabSelect");

  if (activeTabs.size >=2) {
    selector.style.display="block";
    select.innerHTML = "";

    const sortedTabs = Array.from(activeTabs).sort((a, b)=>a - b);
    sortedTabs.forEach((tabNum) => {
      if (tabNum >1 ){
        const option = document.createElement("option");
        option.value = `tab${tabNum}content`;
        option.textContent = `Tab ${tabNum} `;
        select.appendChild(option);
      }
    });
  } else {
    selector.style.display = "none";
  }
}

function closeTab(tabNumber) {
  if (tabNumber === 1) return;

  const button = document.querySelector(`[data-tab="${tabNumber}"]`);
  const content = document.getElementById(`tab${tabNumber}content`);
  const isActive = button && button.classList.contains("activetab");
  
  if (isActive) {
    opentab(1);
  }
  
  if (button) {
    button.remove();
  }
  
  if (content){
    content.remove();
  }

  activeTabs.delete(tabNumber);
  updateTabSelector();
}

function enableTabRenaming(button) {
  button.addEventListener("dblclick", () =>{
    const label = button.querySelector(".tab-label");
    const newName = prompt("Rename this tab", label.textContent);
    if (newName){
      label.textContent = newName;
    }
  });
}

function attachTabClick(button, tabNumber){
  button.addEventListener("click", (e) =>{
    if (e.target.classList.contains("xbutton")) return;
    opentab(parseInt(tabNumber))
  });
}
