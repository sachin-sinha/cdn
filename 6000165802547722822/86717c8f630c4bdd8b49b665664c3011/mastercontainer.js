
    const containerList = ["496ce8f65af94180b1b148723ff3e9c5","d55f76104d924d78a9a670a0ba573e7a"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/6000165802547722822/86717c8f630c4bdd8b49b665664c3011/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  