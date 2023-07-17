
    const containerList = ["496ce8f65af94180b1b148723ff3e9c5","d950f16896ea41f3b2cc6689ad246d0f"];
    var d = document,
    s = d.getElementsByTagName('script')[0];
    containerList.forEach(container => {
      fetch(`https://raw.githubusercontent.com/sachin-sinha/cdn/master/6000165802547722822/158139fd6cb545a3a3313b43967d1c84/${container}.js`)
      .then(response => response.text())
      .then(scriptText => {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.text = scriptText;
        s.parentNode.insertBefore(script, s);
      });
    })
  