window.addEventListener("load", function(){
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i<inputs.length; i++)
	{
		var el = inputs[i];
		if (el.getAttribute("type") === "slider")
		{
			var formInputHidden = null;
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
					else if (key === "step") value = parseFloat(value);
					else if (key === "value") value = parseFloat(value);
					else if (key === "width") value = parseFloat(value);
					else if (key === "name")
					{
						formInputHidden = document.createElement("input");
						formInputHidden.setAttribute("type", "hidden");
						formInputHidden.setAttribute("name", value);
						el.parentNode.appendChild(formInputHidden);
						continue;
					}
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
					sliderKnob.style.opacity = 0.5;
					sliderKnob.style.transitionProperty = "left";
					sliderKnob.style.transitionDuration = "0.1s";
				}
				slider.appendChild(sliderKnob);
				
				if (!slider.hasOwnProperty("width"))
				{
					slider.width = 100;
				}
				slider.style.width = slider.width+"px";
				
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
				
				var slideDistance = parseInt(slider.width - parseInt(sliderKnob.style.width));
				
				slider._theValue = slider._initValue;
				
				Object.defineProperty(slider, "value", {
					get: function() { return slider._theValue; },
					set: function(newValue)
					{
						console.log("Setting slider value to "+newValue);
						newValue = parseFloat(newValue);
						if (newValue < slider.min) newValue = slider.min;
						if (newValue > slider.max) newValue = slider.max;
						var oldValue = slider._theValue;
						if (slider.hasOwnProperty("step"))
						{
							newValue = oldValue + Math.round((newValue - oldValue)/slider.step)*slider.step;
						}
						slider._theValue = newValue;
						
						/*setTimeout(function(){
							console.log("slider.clientWidth="+slider.clientWidth);
							console.log("slider.offsetWidth="+slider.offsetWidth);
							console.log("slider.getBoundingClientRect().width="+slider.getBoundingClientRect().width);
						}, 1000);*/
						sliderKnob.style.left = ((newValue-slider.min) / (slider.max-slider.min) * slideDistance) + "px";
						if (formInputHidden != null) formInputHidden.value = newValue;
						//console.log("knob now at: "+sliderKnob.style.left);
						if (newValue != oldValue)
						{
							for (var i=0; i<slider._onChangeCallbacks.length; i++)
							{
								slider._onChangeCallbacks[i]();
							}
						}
					}
				});
				slider._onChangeCallbacks = [];
				slider.value = slider._initValue;
				
				var dragging = false;
				var startDraggingMouseX = null;
				var startDraggingValue = null;
				
				sliderKnob.addEventListener("mousedown", function(e){
					startDraggingMouseX = e.clientX;
					startDraggingValue = slider.value;
					dragging = true;
				});
				window.addEventListener("mousemove", function(e){
					if (dragging)
					{
						slider.value = startDraggingValue + (e.clientX - startDraggingMouseX) * (slider.max-slider.min) / slideDistance;
					}
					e.preventDefault();
					return false;
				});
				document.addEventListener("mouseout", function(e){
					var from = e.relatedTarget || e.toElement;
					if (!from || from.nodeName == "HTML")
					{
						if (dragging)
						{
							dragging = false;
							e.preventDefault();
							return false;
						}
					}
				});
				document.addEventListener("mouseup", function(e){
					if (dragging)
					{
						dragging = false;
						e.preventDefault();
						return false;
					}
				});
				
				var oldAddEventListener = slider.addEventListener;
				slider.addEventListener = function(event, callback) // not lol?
				{
					if (event === "change")
					{
						
					}
					else
					{
						oldAddEventListener(event, callback);
						//throw "Event '"+event+"' is not implemented by <input type='slider'>. Try 'change'.";
					}
				};
			}
			el.parentNode.replaceChild(slider, el);
		}
	}
});
