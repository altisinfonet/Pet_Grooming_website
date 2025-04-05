import ReactCrop from 'react-image-crop';
import Image from "next/image";

function CropImageModel({ src }) {
  const [crop, setCrop] = useState()
  return (
    <ReactCrop crop={crop} onChange={c => setCrop(c)}>
      <Image src={src} />
    </ReactCrop>
  )
}

export default CropImageModel;
