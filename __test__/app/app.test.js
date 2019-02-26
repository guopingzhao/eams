import App from "app"
it("1 + 2 = 3", () => {
    const app = new App()
    expect(app.jestTest(1, 2)).toBe(3)
})
