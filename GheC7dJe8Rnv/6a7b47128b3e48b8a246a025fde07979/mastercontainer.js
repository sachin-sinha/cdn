const containerList = ["636eec234aca4f5882c8d92c89ad2090"];
var d = document,
s = d.getElementsByTagName('script')[0];
containerList.forEach(container => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://cdn.jsdelivr.net/gh/sachin-sinha/cdn@master/GheC7dJe8Rnv/6a7b47128b3e48b8a246a025fde07979/${container}.min.js`;
    s.parentNode.insertBefore(script, s);
})
