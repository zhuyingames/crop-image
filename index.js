const file = document.getElementById("file");
const origin = document.getElementById("origin");
const radio1 = document.getElementById("radio1");
const radio2 = document.getElementById("radio2");
const number_group = document.getElementById("number_group");
const x = document.getElementById("x");
const y = document.getElementById("y");
const w = document.getElementById("w");
const h = document.getElementById("h");
const text_group = document.getElementById("text_group");
const json = document.getElementById("json");
const crop = document.getElementById("crop");
const reset = document.getElementById("reset");
const output = document.getElementById("output");
const cropped = document.getElementById("cropped");
const file_name = document.getElementById("file_name");
const download = document.getElementById("download");
const download_webp = document.getElementById("download_webp");
const download_jpeg = document.getElementById("download_jpeg");

const originContext = origin.getContext("2d");
const croppedContext = cropped.getContext("2d");

let imageLoaded = false;
let imageCropped = false;

function info(msg) {
  output.innerText = "输出: " + msg;
}

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
      json.value = JSON.stringify(
        {
          x: 0,
          y: 0,
          w: image.width,
          h: image.height,
        },
        null,
        2
      );
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
  if (radioChoose === 1) {
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
  } else if (radioChoose === 2) {
    if (json.value === "") {
      output.innerText = "输出: JSON输入框不能为空";
      return;
    }
    try {
      const obj = JSON.parse(json.value);
      const posX = obj["x"];
      const posY = obj["y"];
      const width = obj["w"];
      const height = obj["h"];
      if (posX === undefined) {
        info("字段x为空");
        return;
      }
      if (isNaN(posX)) {
        output.innerText = "输出: x为无效数字";
        return;
      }
      if (posY === undefined) {
        info("字段y为空");
        return;
      }
      if (isNaN(posY)) {
        output.innerText = "输出: y为无效数字";
        return;
      }
      if (width === undefined) {
        info("字段w为空");
        return;
      }
      if (isNaN(width)) {
        output.innerText = "输出: w为无效数字";
        return;
      }
      if (height === undefined) {
        info("字段h为空");
        return;
      }
      if (isNaN(height)) {
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
    } catch (error) {
      output.innerText = error;
    }
  }
};

reset.onclick = () => {
  if (!imageLoaded) {
    output.innerText = "输出: 请先选择原始图片";
    return;
  }
  if (radioChoose === 1) {
    x.value = String(0);
    y.value = String(0);
    w.value = origin.width;
    h.value = origin.height;
    output.innerText = "输出: 重置成功";
  } else if (radioChoose === 2) {
    json.value = JSON.stringify(
      {
        x: 0,
        y: 0,
        w: origin.width,
        h: origin.height,
      },
      null,
      2
    );
    output.innerText = "输出: 重置成功";
  }
};

function downloadImage(name, type) {
  const link = document.createElement("a");
  link.download = name;
  link.href = cropped.toDataURL(type);
  link.click();
}

file_name.value = "result";

function downloadImageCallback(name, type) {
  if (!imageLoaded) {
    output.innerText = "输出: 请先选择原始图片";
    return;
  }
  if (!imageCropped) {
    output.innerText = "输出: 请先裁剪图片";
    return;
  }
  if (file_name.value === "") {
    output.innerText = "输出: 文件名不能为空";
    return;
  }
  downloadImage(name, type);
  output.innerText = "输出: 下载成功";
}

download.onclick = () => {
  downloadImageCallback(file_name.value + ".png", "image/png");
};

download_webp.onclick = () => {
  downloadImageCallback(file_name.value + ".webp", "image/webp");
};

download_jpeg.onclick = () => {
  downloadImageCallback(file_name.value + ".jpeg", "image/jpeg");
};

let radioChoose = 1;
number_group.style.display = "block";
text_group.style.display = "none";

radio1.onchange = () => {
  radioChoose = 1;
  number_group.style.display = "block";
  text_group.style.display = "none";
};

radio2.onchange = () => {
  radioChoose = 2;
  number_group.style.display = "none";
  text_group.style.display = "block";
};
