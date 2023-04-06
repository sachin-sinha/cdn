
    const containerList = ["e4af2acda44b4112b1aaeee11bd04211"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/burhan/7b3aeb4bf1464ce28afec6ecb7c36d4c/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  