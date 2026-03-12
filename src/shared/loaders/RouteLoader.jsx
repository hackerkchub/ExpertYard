import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLoader } from "./LoaderContext";

export default function RouteLoader(){

const location = useLocation()
const { showLoader , hideLoader } = useLoader()

useEffect(() => {

  showLoader()

  const t = setTimeout(() => {
    hideLoader()
  },300)

  return () => {
    clearTimeout(t)
    hideLoader()
  }

},[location])

return null
}