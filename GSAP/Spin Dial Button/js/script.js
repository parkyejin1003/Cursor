console.clear();

//it doesn't get much easier than this ;)
const draggable = Draggable.create("#knob", {
  type: "rotation",
  inertia: true,
  onDrag: function() {
    console.log(this.rotation)
  }
});

$("#rotation").click(function() {
  console.log(gsap.getProperty("#knob", "rotation"), "from element");
  console.log(Draggable.get("#knob").rotation, "from the Draggable");
});
