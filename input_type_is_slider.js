window.addEventListener("load", function(){
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i<inputs.length; i++)
	{
		var el = inputs[i];
		if (el.getAttribute("type") === "slider")
		{
			var slider = document.createElement("div");
			{
				slider.style.height = "0px";
				slider.style.maxHeight = "0px";
				slider.style.borderLeftWidth = "0px";
				slider.style.borderTopWidth = "3px";
				slider.style.borderRightWidth = "0px";
				slider.style.borderBottomWidth = "0px";
				slider.style.borderStyle = "solid";
				slider.style.borderColor = "black";
				slider.style.marginTop = "25px";
				slider.style.marginBottom = "25px";
				for (var j=0; j<el.getAttributeNames().length; j++)
				{
					var key = el.getAttributeNames()[j];
					var value = el.getAttribute(key);
					if (key === "type") continue;
					else if (key === "min") value = parseFloat(value);
					else if (key === "max") value = parseFloat(value);
					else if (key === "value") value = parseFloat(value);
					else continue;
					slider.setAttribute(key, value);
					slider[key] = value;
				}
				
				var sliderKnob = document.createElement("div");
				{
					sliderKnob.style.width = "40px";
					sliderKnob.style.height = "40px";
					sliderKnob.style.borderRadius = "20px";
					sliderKnob.style.backgroundColor = "black";
					sliderKnob.style.position = "relative";
					sliderKnob.style.top = "-20px";
				}
				slider.appendChild(sliderKnob);
				
				if (!slider.hasOwnProperty("min"))
				{
					if (!slider.hasOwnProperty("max"))
					{
						slider.min = 0;
					}
					else if (slider.max > 0)
					{
						slider.min = 0;
					}
					else if (slider.max < 0)
					{
						slider.min = slider.max * 2;
					}
					else
					{
						slider.min = -100;
					}
				}
				if (!slider.hasOwnProperty("max"))
				{
					if (slider.min > 0) slider.max = slider.min * 2;
					else if (slider.min < 0) slider.max = slider.min * 2;
					else slider.max = 100;
				}
				if (slider.hasOwnProperty("value"))
				{
					if (slider.value < slider.min) slider._initValue = slider.min;
					else if (slider.value > slider.max) slider._initValue = slider.max;
					else slider._initValue = slider.value;
				}
				else
				{
					slider._initValue = slider.min;
				}
				
				Object.defineProperty(slider, "value", {
					get: function() { return slider._theValue; },
					set: function(newValue)
					{
						newValue = parseFloat(newValue);
						slider._theValue = newValue;
						sliderKnob.style.left = ((newValue-min) / (max-min) * sliderWidth) + "px";
					}
				});
				
				slider.value = slider._initValue;
			}
			el.parentNode.replaceChild(slider, el);
		}
	}
});
