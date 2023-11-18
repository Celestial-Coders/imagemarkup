const express = require('express');
const router = express.Router();
const fs = require('fs');
const schemas = require('../models/schemas')

 router.get('/load-anno', async (req, res) => {
  const imageId = '1'; 
  console.log("loading")
  schemas.Image.findOne({ id: imageId })
      .then(image => {
          if (image) {
              console.log('Image loaded:', image);
              res.send(image.data);
          } else {
              console.log('Image not found.');
              return res.status(500).send('Error reading data');
          }
      })
      .catch(error => {
          console.error('Error loading image:', error);
      });
    // fs.readFile('annotations.json', 'utf8', (readErr, data) => {
    //   if (readErr) {
    //     console.log("read file error");
    //     return res.status(500).send('Error reading file');
    //   }
  
    //   let existingAnnotations;
  
    //   try {
    //     existingAnnotations = JSON.parse(data);
    //   } catch (parseErr) {
    //     console.log("parse error");
    //     return res.status(500).send('Error parsing JSON');
    //   }
    //   console.log(existingAnnotations);
    //   res.send(existingAnnotations);
    // })
});

router.post('/save-anno', async (req, res) => {
  const annotations = req.body;
  //console.log(req.body);

  // imageData = {id: 1, data:annotations}
  // const newImage = new schemas.Image(imageData)
  // const saveImage = await newImage.save()
  // if(saveImage){
  //   res.send('image data added to db')
  // }else{
  //   res.send('failed to save to db')
  // }

  schemas.Image.findOneAndUpdate(
    { id: 1 },
    { $set: { data: annotations } }, 
    { upsert: true, new: true } 
  )
    .then(updatedImage => {
        if (updatedImage) {
            console.log('Image updated:', updatedImage);
        } else {
            console.log('New image created.');
        }
    })
    .catch(error => {
        console.error('Error updating or saving image:', error);
    });

  res.end()

  // fs.readFile('annotations.json', 'utf8', (readErr, data) => {
  //   if (readErr) {
  //     console.log("read file error");
  //     return res.status(500).send('Error reading file');
  //   }

  //   let existingAnnotations;

  //   try {
  //     existingAnnotations = JSON.parse(data);
  //   } catch (parseErr) {
  //     console.log("parse error");
  //     return res.status(500).send('Error parsing JSON');
  //   }

  //   const updatedAnnotations = [...existingAnnotations, ...annotations];

  //   fs.writeFile('annotations.json', JSON.stringify(updatedAnnotations, null, 2), 'utf8', (writeErr) => {
  //     if (writeErr) {
  //       console.log("write file error");
  //       return res.status(500).send('Error writing file');
  //     }

  //     console.log("Annotations saved to file");
  //     res.send('Annotations saved to file');
  //   });
  // });
});

module.exports = router;