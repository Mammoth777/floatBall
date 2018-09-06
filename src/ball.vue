<template>
  <div id="ball">
    <div class="ball-shape"></div>
    <!-- <ul>
      <li class="tab"></li>
    </ul> -->
  </div>
</template>

<script>
import Drag from './assets/drag'
export default {
  name: 'ball',
  mounted () {
    this.dragbox = new Drag('ball', {y: 200})
    this.dragbox.onClick = function (coord) {
      console.log('click');
      console.log(coord);
    }
    
  }
}
</script>

<style scoped>
div.ball-shape{
  background-color: #ccc;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  opacity: .5;
}
.tab{
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #cec;
  position: absolute;
  left: -20px;
  top: -20px;
}
</style>
