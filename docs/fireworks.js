(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{3:function(t,e,s){"use strict";s.r(e);var i=s(2),o=function(){function t(t){this.fireworks=[],this.scene=t,this.draw=this.draw.bind(this)}return t.prototype.draw=function(){10===i.Math.randInt(1,20)&&this.fireworks.push(new r(this.scene));for(var t=0;t<this.fireworks.length;t++)this.fireworks[t].done?this.fireworks.splice(t,1):this.fireworks[t].update()},t}();e.default=o;var r=function(){function t(t){this.done=!1,this.dest=[],this.colors=[],this.geometry=new i.Geometry,this.material=new i.PointsMaterial({size:16,color:16777215,opacity:1,transparent:!0,depthTest:!1,vertexColors:i.VertexColors}),this.scene=t,this.points=new i.Points(this.geometry,this.material),this.launch()}return t.prototype.update=function(){if(this.points&&this.geometry){for(var t=this.geometry.vertices.length,e=0;e<t;e++){var s=this.geometry.vertices[e],o=this.dest[e];s.x+=(o.x-s.x)/20,s.y+=(o.y-s.y)/20,s.z+=(o.z-s.z)/20,this.geometry.verticesNeedUpdate=!0}if(1===t){var r=this.geometry.vertices[0];if(i.Math.ceilPowerOfTwo(r.y)>this.dest[0].y-20)return void this.explode(r)}if(t>1&&(this.material.opacity-=.015,this.geometry.colorsNeedUpdate=!0),this.material.opacity<=0)return this.reset(),void(this.done=!0)}},t.prototype.launch=function(){var t=window.innerWidth,e=i.Math.randInt(-t,t),s=i.Math.randInt(100,800),o=i.Math.randInt(-1e3,-3e3),r=new i.Vector3(e,-800,o),n=new i.Vector3(e,s,o),h=new i.Color;h.setHSL(i.Math.randFloat(.1,.9),1,.9),this.colors.push(h),this.geometry.colors=this.colors,this.geometry.vertices.push(r),this.dest.push(n),this.colors.push(h),this.scene.add(this.points)},t.prototype.explode=function(t){this.scene.remove(this.points),this.dest=[],this.colors=[],this.geometry=new i.Geometry,this.points=new i.Points(this.geometry,this.material);for(var e=0;e<80;e++){var s=new i.Color;s.setHSL(i.Math.randFloat(.1,.9),1,.5),this.colors.push(s);var o=new i.Vector3(i.Math.randInt(t.x-10,t.x+10),i.Math.randInt(t.y-10,t.y+10),i.Math.randInt(t.z-10,t.z+10)),r=new i.Vector3(i.Math.randInt(t.x-1e3,t.x+1e3),i.Math.randInt(t.y-1e3,t.y+1e3),i.Math.randInt(t.z-1e3,t.z+1e3));this.geometry.vertices.push(o),this.dest.push(r)}this.geometry.colors=this.colors,this.scene.add(this.points)},t.prototype.reset=function(){this.scene.remove(this.points),this.dest=[],this.colors=[],this.geometry=null,this.points=null},t}()}}]);
//# sourceMappingURL=fireworks.js.map