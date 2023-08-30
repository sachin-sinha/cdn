const containerList = ["496ce8f65af94180b1b148723ff3e9c5","964d1b68c54d4f31a9c5ff51221a44a9"];
var d = document,
s = d.getElementsByTagName('script')[0];
containerList.forEach(container => {
  fetch(
        `https://raw.githubusercontent.com/sachin-sinha/cdn/master/GheC7dJe8Rnv/dcebba5bfb6b498bbb9cd28ec8b0e2f6/${container}.js`
      )
        .then((response) => response.text())
        .then((scriptText) => {
          const script = document.createElement("script");
          script.type = "text/javascript";
          script.async = true;
          script.text = scriptText;
          s.parentNode.insertBefore(script, s);
        });
})
