export default function LegalLoader({

    message = "Loading legal documents..."

}) {

    return (

        <div style={styles.overlay}>

            <div style={styles.card}>

                <div style={styles.spinner}></div>

                <h3 style={styles.title}>
                    Please Wait
                </h3>

                <p style={styles.message}>
                    {message}
                </p>

            </div>

        </div>

    );

}

const styles = {

overlay:{
position:"fixed",
inset:0,
background:"rgba(255,255,255,.75)",
display:"flex",
alignItems:"center",
justifyContent:"center",
zIndex:999999999
},

card:{
background:"#fff",
padding:"30px 40px",
borderRadius:12,
boxShadow:"0 15px 40px rgba(0,0,0,.15)",
display:"flex",
flexDirection:"column",
alignItems:"center",
minWidth:260
},

spinner:{
width:42,
height:42,
border:"4px solid #e5e7eb",
borderTop:"4px solid #2563eb",
borderRadius:"50%",
animation:"legalSpin .8s linear infinite"
},

title:{
marginTop:20,
marginBottom:10
},

message:{
color:"#666",
textAlign:"center"
}

};

const style=document.createElement("style");

style.innerHTML=`

@keyframes legalSpin{

0%{

transform:rotate(0deg);

}

100%{

transform:rotate(360deg);

}

}

`;

if(!document.getElementById("legal-loader-style")){

style.id="legal-loader-style";

document.head.appendChild(style);

}