let imgBox = document.getElementById("imgBox");
let qrImage = document.getElementById("qrImage");
let qrText = document.getElementById("qrText");
let canvas = document.getElementById("canvas");
const downloadBtn = document.getElementById("downloadBtn");
let password = document.getElementById("password");
let upload = document.getElementById("upload");
let image = document.createElement('img');

function generateQR(){

  let Emaster = document.getElementById("Emaster");
  qrImage.src = "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + qrText.value;

  qrImage.crossOrigin = 'Anonymous';

  if(qrText.value.length > 0){

    qrImage.addEventListener('load', function(){

      imgBox.classList.add("show-img");

      const context = canvas.getContext('2d');

      canvas.width=qrImage.width;
      canvas.height=qrImage.height;

      context.drawImage(qrImage, 0, 0, canvas.width, canvas.height)

      const scannedImage = context.getImageData(0, 0, canvas.width, canvas.height);
      const scannedData = scannedImage.data;

        let k=1;

        for(let j=0;j<Emaster.value.length; j++){

          k = Number(Emaster.value[j])*j;

          for(let i=0; i<90000; i+=4){
            if((i)%600==0){
              k+=111;
              k = (k)%256;
            }

            scannedData[i] =  (scannedData[i] + (k+10))%256;
            scannedData[i+1] =  (scannedData[i+1] + (k+70))%256;
            scannedData[i+2] = (scannedData[i+2] + (k+30))%256;

          }

        }

        scannedImage.data =  scannedData;
        context.putImageData(scannedImage, 0, 0);

        const a = document.createElement("a");

        a.href = canvas.toDataURL("image/png");
        a.download = 'canvas_image.png';
        a.style.display = "none";

        downloadBtn.addEventListener("click",() => {
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });

      })

  }
  else{
    qrText.classList.add("error");
    setTimeout(()=>{
      qrText.classList.remove("error");
    },1000);
  }

}

function loading(){
  const imageFile = upload.files[0];
  image.src = URL.createObjectURL(imageFile);
  console.log(image);
}

function decryptor(){

  let Dmaster = document.getElementById("Dmaster");

  // let upload = document.getElementById("upload").files[0];

  let newCanvas = document.createElement("canvas");
  const context = newCanvas.getContext("2d");

  // image.crossOrigin = "Anonymous";

  newCanvas.width = image.width;
  newCanvas.height = image.height;

  context.drawImage(image, 0, 0, newCanvas.width, newCanvas.height);

  const scannedImage = context.getImageData(0, 0, newCanvas.width, newCanvas.height);
  const scannedData = scannedImage.data;


  for(let j=0; j<Dmaster.value.length; j++){

    k = Number(Dmaster.value[j])*j;

    for(let i=0; i<90000; i+=4){

      if(i%600==0){
        k+=111;
        k = (k)%256;
      }

      if((scannedData[i] - (k+10))<0){
        scannedData[i] = 255 - (-(scannedData[i] - (k+10))-1)%256;
      }
      else{
        scannedData[i] = (scannedData[i] - (k+10));
      }

      if((scannedData[i+1] - (k+70))<0){
        scannedData[i+1] = 255 - (-(scannedData[i+1] - (k+70))-1)%256;
      }
      else{
        scannedData[i+1] = (scannedData[i+1] - (k+70));
      }

      if((scannedData[i+2] - (k+30))<0){
        scannedData[i+2] = 255 - (-(scannedData[i+2] - (k+30))-1)%256;
      }
      else{
        scannedData[i+2] = (scannedData[i+2] - (k+30));
      }

    }

  }

  scannedImage.data = scannedData;
  context.putImageData(scannedImage, 0, 0);

  const codeText = newCanvas.toDataURL("image/png");

  console.log(codeText);

  const blob = new Blob(scannedData, {type : 'image/png'});

  let form = document.getElementById("qrForm");

  newCanvas.toBlob(function (blob) {
    // Create a File object from the Blob
    const file = new File([blob], 'file.png', { type: 'image/png' });

    formData.append('file', file);

   fetch(form.action, {
       method: 'POST',
       body: formData
   })
   .then(response => {
       if (!response.ok) {
           throw new Error('Network response was not ok');
       }

       return response.json(); // Parse the response body as JSON
   })
   .then(data => {
       // Use the 'data' received from the API
       const res = JSON.stringify(data, null, 0);
       let result = "";

       let count = 0;
       let i=0;
       while(count!=12){

         if(res[i]=='"') count++;
         else if(count==11) result += res[i];

         i++;
       }

       password.innerHTML += result ;
   })
   .catch(error => {
       console.error('Fetch error:', error);
   });

  });

  const formData = new FormData(form);
  password.style.display = "inline-block";

}

function Eshow(){
  let div = document.getElementById("container");
  div.classList.add("show-div");
}

function Dshow(){
  let div = document.getElementById("decrypt");
  div.classList.add("show-div");
}
