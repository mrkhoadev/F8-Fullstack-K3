F8.component("counter-app", {
    data: () => ({
        count: 0,
        count2: 20,
        count3: 30,
        title: "Counter App",
    }),
    template: `
        <h1>-{{ title }}-</h1>
        <h2>Đã đếm: {{ count }} lần</h2>
        <button v-on:click="count--">-</button>
        <button v-on:click="count++">+</button>
        <button v-on:dblclick="title='Hello F8'">Chang Title</button>
    `,
});
F8.component("header-component", {
    data: () => ({
        abc: 0,
        title: "HEADER",
    }),
    template: `
        <h1>{{ title }}</h1>
        <h2>Đã đếm: {{ abc }} lần</h2>
        <button v-on:click="abc--">-</button>
        <button v-on:click="abc++">+</button>
        <button v-on:mouseover="title='Khó vãi nồi (╯°□°)╯︵ ┻━┻'">Chang Title</button>
    `,
});