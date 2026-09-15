let transactions = [];


// Navigation logic
const navItems = document.querySelectorAll(".bottom-nav button");
const screens = document.querySelectorAll(".screen");

navItems.forEach((item)=> {
    item.addEventListener("click",()=>{
        const targetScreen = item.dataset.screen;
        const target = Array.from(screens).find(screen => {
            return screen.id === targetScreen;
        });
        
        screens.forEach((screen)=>{
            screen.classList.remove("active");
        });

        target.classList.add("active");

        navItems.forEach((item)=>{
            item.classList.remove("active");
        });

        item.classList.add("active");

    });
});
