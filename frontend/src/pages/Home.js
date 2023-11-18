import power from '../assets/images/power.jpg';
import king from '../assets/images/king.jpg';
import monster from '../assets/images/monster.jpg';
import '../App.css';
import { useEffect, useRef, useState } from 'react';
import { Annotorious } from '@recogito/annotorious';
import '@recogito/annotorious/dist/annotorious.min.css';
import axios from "axios"

function Home() {

    // Ref to the image DOM element
    const imgE = useRef();
  
    // The current Annotorious instance
    const [ anno, setAnno ] = useState();
  
    // Current drawing tool name
    const [ tool, setTool ] = useState('rect');
  
    // Current Annotations
    const [ strannos, setStrannos ] = useState('no annotations yet');
    var annotations;
    
    const [error, setError] = useState('');

    const [loadedAnno, setLoadAnno] = useState([]);
  
    // Init Annotorious when the component
    // mounts, and keep the current 'anno'
    // instance in the application state
    useEffect(() => {

      let processing = true
      axiosFetchData(processing)

      let annotorious = null;
  
      if (imgE.current) {
        // Init
        annotorious = new Annotorious({
          image: imgE.current,
        });
        
        //annotations = annotorious.getAnnotations();
        //stranno = annotations;
        
        // Attach event handlers here
        annotorious.on('createAnnotation', annotation => {
          console.log('created', annotation);
          //console.log('annotations', annotations);
        });
        
        annotorious.on('updateAnnotation', (annotation, previous) => {
          console.log('updated', annotation, previous);
        });
  
        annotorious.on('deleteAnnotation', annotation => {
          console.log('deleted', annotation);
        });
  
  
      }

      // Keep current Annotorious instance in state
      setAnno(annotorious);
      
      // Cleanup: destroy current instance
      return () => {
          processing = false;
          annotorious.destroy();
      }
    }, []);
  
    
    // Toggles current tool + button label
    const toggleTool = () => {
      if (tool === 'rect') {
        setTool('polygon');
        anno.setDrawingTool('polygon');
      } else {
        setTool('rect');
        anno.setDrawingTool('rect');
      }
    }
    
    var timestamp = new Date().getTime();
    var image =document.getElementById("img");
    //var imgE = imgE;
    
    const image1 = () => {
      image.src = power
    }
    const image2 = () => {
      image.src = king
      image.id = "002"
      //imgE = imgE2;
    }
    const image3 = () => {
      image.src = monster 
      image.id = "003"
    }

    const showAnno = () => {
      //const annotations = annotorious.getAnnotations();
      // stranno = annotations.body[0].value
      annotations = anno.getAnnotations();
      console.log('Existing Annotations:', annotations);
      var temp = "";
      if(annotations.length > 0){
        for(let i = 0; i < annotations.length; i++){
          temp = temp + annotations[i].body[0].value
          if(i != annotations.length-1){
              temp = temp + ", "
          }
        }
          setStrannos(<p className="success">{temp}</p>);
      }
      //stranno = annotations[0].body[0].value
    }

    const loadAnno = () => {
      console.log(loadedAnno.length);
      for(var i = 0; i < loadedAnno.length; i++){
          console.log(loadedAnno[i].body[0].value);
          anno.addAnnotation(loadedAnno[i]);
      }
    }

    const axiosFetchData = async(processing) => {
      await axios.get('http://localhost:4000/load-anno')
      .then(res => {
          if (processing) {
              setLoadAnno(res.data)
          }
      })
      .catch(err => console.log(err))
    }

    const saveAnno = (e) => {
      e.preventDefault();

      axiosPostData();
    }
  
    
    const axiosPostData = async() => {
      const postData = anno.getAnnotations();
      await axios.post('http://localhost:4000/save-anno', postData)
      .then(res => setError(<p className="success">{res.data}</p>))
    }

    return (
      <div>
        <div>
          <button
            onClick={toggleTool}>
              { tool === 'rect' ? 'RECTANGLE' : 'POLYGON' }
          </button>
          <button
            onClick={showAnno}>
              Show Annotations
          </button>
          <button onClick={image1}>image1</button>
          <button onClick={image2}>image2</button>
          <button onClick={image3}>image3</button>
          <button onClick={saveAnno}>Save Annotations</button> 
          <button onClick={loadAnno}>Load Annotations</button> 

        {strannos}
        {error}
        </div>


        <img 
          id="001"
          ref={imgE} 
          src={power} 
          alt="power" />
      </div>
    );
  }
  
  export default Home;