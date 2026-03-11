import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "./LoaderContext";

export default function RouteLoader(){

const location = useLocation()
const { showLoader , hideLoader } = useLoader()

useEffect(()=>{

showLoader()

const t = setTimeout(()=>{
hideLoader()
},500)

return ()=>clearTimeout(t)

},[location])

return null
}