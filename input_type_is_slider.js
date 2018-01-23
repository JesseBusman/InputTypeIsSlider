
window.addEventListener("load", function(){
	// Constants
	var SLIDER_DEFAULT_WIDTH = 250;
	
	// Basically, we're going to search for all instances of:
	// <input type="slider" .../>
	// and turn it into this:
	// <input type="hidden" .../>
	// <div class="slider"><div class="sliderKnob"></div></div>
	
	
	var inputs = document.getElementsByTagName("input");
	for (var i=0; i<inputs.length; i++)
	{
		var currentElement = inputs[i];
		if (currentElement.getAttribute("type") === "slider")
		{
			(function(el){
				
				// Initialize slider DOM elements
				var slider = document.createElement("div");
				{
					var knobStyle = "";
					
					var sliderLineColor = null;
					var knobPosition = "middle";
					
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
						else if (key === "style") value = value;
						else if (key === "id") value = value;
						else if (key === "knobstyle") { knobStyle = value; continue; }
						else continue;
						slider[key] = value;
						slider.setAttribute(key, value);
					}
					
					el.setAttribute("id", "");
					el.id = "";
					
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
					
					var sliderKnob = document.createElement("div");
					{
						sliderKnob.setAttribute("style", knobStyle);
						sliderKnob.style.width = "40px";
						if (!parseInt(sliderKnob.style.height)) sliderKnob.style.height = "40px";
						sliderKnob.style.borderRadius = "20px";
						sliderKnob.style.backgroundColor = "black";
						sliderKnob.style.position = "relative";
						sliderKnob.style.top = "-20px";
						sliderKnob.style.opacity = 0.5;
						sliderKnob.style.left = "0px";
					}
					slider.appendChild(sliderKnob);
					
					// If the user did not define a width, set it to the default.
					if (!slider.hasOwnProperty("width")) slider.width = SLIDER_DEFAULT_WIDTH;
					
					// 
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
					
					var slideDistance;
					function updateSlideDistance()
					{
						// TODO figure out why this is *1.5, and not just *1 or something
						slideDistance = parseInt(slider.width) - parseInt(sliderKnob.style.width) * 1.5;
					}
					updateSlideDistance();
					
					console.log("slide.width="+slider.width);
					console.log("slideDistance="+slideDistance);
					
					// If the step value is causing the slider to skip more than 10 pixels,
					// add a small transition to make it step smoother.
					if (slider.hasOwnProperty("step"))
					{
						var pixelsPerStep = slideDistance / ((slider.max - slider.min) / slider.step);
						console.log("pixelsPerStep="+pixelsPerStep);
						if (pixelsPerStep > 10)
						{
							sliderKnob.style.transitionProperty = "left";
							sliderKnob.style.transitionDuration = "0.1s";
						}
					}
					slider._theValue = slider._initValue;
					
					Object.defineProperty(slider, "value", {
						get: function() { return slider._theValue; },
						set: function(newValue)
						{
							newValue = parseFloat(newValue);
							if (newValue < slider.min) newValue = slider.min;
							if (newValue > slider.max) newValue = slider.max;
							var oldValue = slider._theValue;
							if (slider.hasOwnProperty("step"))
							{
								newValue = oldValue + Math.round((newValue - oldValue)/slider.step)*slider.step;
							}
							slider._theValue = newValue;
							
							if (newValue === oldValue) return;
							
							/*setTimeout(function(){
								console.log("slider.clientWidth="+slider.clientWidth);
								console.log("slider.offsetWidth="+slider.offsetWidth);
								console.log("slider.getBoundingClientRect().width="+slider.getBoundingClientRect().width);
							}, 1000);*/
							
							updateSliderKnobPosition();
							
							el.value = newValue;
							
							for (var i=0; i<slider._onChangeCallbacks.length; i++)
							{
								console.log("slider triggering change event listener...");
								slider._onChangeCallbacks[i]();
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
					slider.addEventListener = function(event, callback)
					{
						if (event === "change") slider._onChangeCallbacks.push(callback);
						else oldAddEventListener(event, callback);
					};
					var oldSetAttribute = slider.setAttribute;
					slider.setAttribute = function(key, value)
					{
						if (key === "width")
						{
							slider.width = parseInt(value);
							slider.style.width = slider.width + "px";
							updateSlideDistance();
							updateSliderKnobPosition();
						}
						else oldSetAttribute(key, value);
					};
				}
				el.parentNode.insertBefore(slider, el);
				el.setAttribute("type", "hidden");
				
				function updateSliderKnobPosition()
				{
					var newSliderPosition = (slider._theValue-slider.min) / (slider.max-slider.min) * slideDistance;
					//var changeInSliderPosition = Math.abs(newSliderPosition - parseInt(sliderKnob.style.left));
					
					sliderKnob.style.left = newSliderPosition + "px";
				}
			})(currentElement);
		}
	}
});
