gsap.registerPlugin(Draggable);

const colors = [
  ["rgb(155, 237, 255)","rgb(3, 127, 154)"],
  ["rgb(10, 228, 72)","rgb(171, 255, 132)"],
  ["rgb(255, 135, 9)","rgb(247, 189, 248)"],
  ["rgb(241, 0, 203)","rgb(254, 197, 251)"]
]

const logo = document.querySelectorAll('.logo')
const imgGroup = document.querySelector('.img-group')
const items = document.querySelectorAll('.img-group img')

items.forEach((item,i)=>{
  
  const itemColor = colors[i]
  
  Draggable.create(item, {
    onPress:()=>{ // bring the item forward on press
      gsap.to(item, {duration:0.1, scale:1.2, rotate:'random(-9,9)', zIndex:100})
      gsap.to(items, {duration:0.1, opacity:(i,t)=>(t==item)?1:0.3})
    },
    
    onRelease:()=>{ // return the item on release
      gsap.to(item, {duration:0.4, x:0, y:0, rotate:0, scale:1, ease:'elastic.out(.45)'})
      gsap.to(items, {duration:0.2, opacity:1, zIndex:0 })
    },
    
    onDrag:()=>{
      if ( !gsap.isTweening(logo) ){ // prevent overlapping color changes
        if ( Draggable.hitTest(item, logo, 12) ){ // check if item is over the logo
          gsap.to('.logo #gradient stop', { // if so, change stop element's stop-color attribute
            attr:{ 'stop-color' : (n) => itemColor[n] }
          })
        }
      }
    }
  })
  
})


// // 💚 This just adds the GSAP link to this pen, don't copy this bit
// import { GSAPInfoBar } from "https://codepen.io/GreenSock/pen/vYqpyLg.js"
// new GSAPInfoBar({ link: "https://gsap.com/docs/v3/Plugins/Draggable/" });
// // 💚 Happy tweening!