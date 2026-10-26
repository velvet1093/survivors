// Stable layered DAG layout. Multiple prerequisites become visible fork/join edges.
export function treeParents(node){return [...new Set(node.parents?.length?node.parents:node.parent?[node.parent]:[])];}
export function layoutSkillTree(tree,{minWidth=680,columnGap=148,rowGap=136,padding=62,topPadding=padding,maxColumns=4}={}){
 const byId=new Map(tree.map((node,index)=>[node.id,{...node,index}])),depth=new Map(),visiting=new Set();
 if(byId.size!==tree.length)throw Error('Duplicate skill node');
 const visit=id=>{
  if(depth.has(id))return depth.get(id);
  if(visiting.has(id))throw Error('Skill prerequisites contain a cycle');
  const node=byId.get(id);if(!node)throw Error('Unknown prerequisite: '+id);
  visiting.add(id);const parents=treeParents(node),level=parents.length?Math.max(...parents.map(visit))+1:0;visiting.delete(id);depth.set(id,level);return level;
 };
 tree.forEach(node=>visit(node.id));
 const rows=[];for(const node of byId.values())(rows[depth.get(node.id)]??=[]).push(node);
 const width=Math.max(minWidth,Math.min(maxColumns,Math.max(1,...rows.map(row=>row.length)))*columnGap+padding*2),positions=new Map();let visualRow=0;
 rows.forEach((row,level)=>{
  const barycenter=node=>{const parents=treeParents(node);return parents.length?parents.reduce((sum,id)=>sum+positions.get(id).x,0)/parents.length:node.index/tree.length*width;};
  row.sort((a,b)=>barycenter(a)-barycenter(b)||a.index-b.index);
  for(let start=0;start<row.length;start+=maxColumns){const section=row.slice(start,start+maxColumns),span=(section.length-1)*columnGap,left=(width-span)/2;
   section.forEach((node,i)=>positions.set(node.id,{id:node.id,x:section.length===1?width/2:left+i*span/(section.length-1),y:topPadding+visualRow*rowGap,depth:level,row:visualRow}));visualRow++;
  }
 });
 const nodes=tree.map(node=>({...node,...positions.get(node.id)})),edges=nodes.flatMap(node=>treeParents(node).map(parent=>{
  const from=positions.get(parent),to=positions.get(node.id),startY=from.y+37,endY=to.y-36,midY=startY+(endY-startY)*.58;
  return {from:parent,to:node.id,path:`M${from.x},${startY} V${midY} L${to.x},${endY}`};
 }));
 return {width,height:topPadding+Math.max(0,visualRow-1)*rowGap+100,nodes,edges};
}
