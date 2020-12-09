export class <%= classify(name) %> {
    constructor(<%= name %>: any) {
		Object.assign(this, <%= name %>)
    }
    <% for(let p of props) {  %>
     <%= p.n %> : <%= p.t %> 
    <% } %>
}