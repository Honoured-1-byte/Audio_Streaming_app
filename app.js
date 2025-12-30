let url="https://catfact.ninja/breeds?limit=1";
async function grtFact(){
    let res = await fetch(url);
    let data=await res.json();
    console.log(data.fact);
}