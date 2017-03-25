function faces(rgbaColor) {
  let canvas = document.querySelector('.main-canvas');
  canvas.width = 256;
  canvas.height = 256;
  let context = canvas.getContext('2d');
  if (context) {
    //画一个宽高都是256的黑色正方形
    context.fillStyle = 'rgba(0,0,0,1)';
    context.fillRect(0, 0, 256, 256);
    //在内部用某颜色的16px宽的线再画一个宽高为224的圆角正方形并用改颜色填充
    context.rect(16, 16, 224, 224);
    context.lineJoin = 'round';
    context.lineWidth = 16;
    context.fillStyle = rgbaColor;
    context.strokeStyle = rgbaColor;
    context.stroke();
    context.fill();
  } else {
    alert('您的浏览器不支持Canvas无法预览.\n');
  }
  return canvas;
}

faces('rgba(255,193,37,1)');

