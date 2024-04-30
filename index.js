const file = document.getElementById("file");
const origin = document.getElementById("origin");
const x = document.getElementById("x");
const y = document.getElementById("y");
const w = document.getElementById("w");
const h = document.getElementById("h");
const crop = document.getElementById("crop");
const reset = document.getElementById("reset");
const output = document.getElementById("output");
const cropped = document.getElementById("cropped");
const download = document.getElementById("download");

const originContext = origin.getContext("2d");
const croppedContext = cropped.getContext("2d");

let imageLoaded = false;
let imageCropped = false;

file.addEventListener("change", (event) => {
  const fileObject = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => {
    const image = new Image();
    image.onload = () => {
      imageLoaded = true;
      x.value = String(0);
      y.value = String(0);
      w.value = image.width;
      h.value = image.height;
      origin.width = image.width;
      origin.height = image.height;
      originContext.drawImage(image, 0, 0);
    };
    image.src = e.target.result;
  };
  reader.readAsDataURL(fileObject);
});

crop.onclick = () => {
  if (!imageLoaded) {
    output.innerText = "输出: 请先选择原始图片";
    return;
  }
  const posX = Math.floor(parseInt(x.value));
  const posY = Math.floor(parseInt(y.value));
  const width = Math.floor(parseInt(w.value));
  const height = Math.floor(parseInt(h.value));
  if (isNaN(posX)) {
    output.innerText = "输出: x为无效数字";
    return;
  } else if (isNaN(posY)) {
    output.innerText = "输出: y为无效数字";
    return;
  } else if (isNaN(width)) {
    output.innerText = "输出: w为无效数字";
    return;
  } else if (isNaN(height)) {
    output.innerText = "输出: h为无效数字";
    return;
  }
  cropped.width = width;
  cropped.height = height;
  croppedContext.drawImage(
    origin,
    posX,
    posY,
    width,
    height,
    0,
    0,
    width,
    height
  );
  output.innerText = "输出: 裁剪成功";
  imageCropped = true;
};

reset.onclick = () => {
  if (!imageLoaded) {
    output.innerText = "输出: 请先选择原始图片";
    return;
  }
  x.value = String(0);
  y.value = String(0);
  w.value = origin.width;
  h.value = origin.height;
  output.innerText = "输出: 重置成功";
};

download.onclick = () => {
  if (!imageLoaded) {
    output.innerText = "输出: 请先选择原始图片";
    return;
  }
  if (!imageCropped) {
    output.innerText = "输出: 请先裁剪图片";
    return;
  }
  const link = document.createElement("a");
  link.download = "result.png";
  link.href = cropped.toDataURL("image/png");
  link.click();
  output.innerText = "输出: 下载成功";
};
