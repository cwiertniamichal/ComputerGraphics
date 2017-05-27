function Modifier(timeArray, valueArray){
	this.times = timeArray || [];
	this.values = valueArray || [];
}

Modifier.prototype.lerp = function(t){
	var i = 0;
	while(i < this.times.length && t > this.times[i])  
		i++;
	if(i == 0) 
		return this.values[0];
	if (i == this.times.length)	
		return this.values[this.times.length-1];
	var val = (t - this.times[i-1]) / (this.times[i] - this.times[i-1]);
	
	if(this.values[0] instanceof THREE.Vector3)
		return this.values[i-1].clone().lerp(this.values[i], val);
	else
		return this.values[i-1] + val * (this.values[i] - this.values[i-1]);
}