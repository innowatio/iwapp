import {shallow} from "enzyme";
import Button from "react-native-button";
import {Image} from "react-native";

import Login from "views/login";
import TextInputLato from "components/text-input-lato";
import TextLato from "components/text-lato";

describe("`login` view", () => {

    const asteroid = {};

    it("renders an `Image`", () => {
        const login = shallow(<Login asteroid={asteroid} />);
        expect(login.find(Image)).to.have.length(1);
    });

    it("renders 2 `TextInputLato`", () => {
        const login = shallow(<Login asteroid={asteroid} />);
        expect(login.find(TextInputLato)).to.have.length(2);
    });

    it("renders a `Button` with correct children", () => {
        const login = shallow(<Login asteroid={asteroid} />);
        expect(login.find(Button)).to.have.length(1);
        expect(login.find(Button).find(TextLato).prop("children")).to.equal("ACCEDI");
    });

    it("call `onLogin` function when Button is pressed", () => {
        const onPressButtonSpy = sinon.spy();
        Login.prototype.onLogin = onPressButtonSpy;
        const login = shallow(<Login asteroid={asteroid} />);
        const button = login.find(Button);
        const instance = login.instance();
        button.simulate("press");
        expect(onPressButtonSpy).to.have.callCount(1);
        expect(onPressButtonSpy).to.have.calledOn(instance);
    });

    it("call `renderErrorLogin` function", () => {
        const renderErrorLoginSpy = sinon.spy();
        Login.prototype.renderErrorLogin = renderErrorLoginSpy;
        shallow(<Login asteroid={asteroid} />);
        expect(renderErrorLoginSpy).to.have.callCount(1);
    });

    describe("`TextInput` email field", () => {

        it("renders the correct placeholder", () => {
            const login = shallow(<Login asteroid={asteroid} />);
            const emailTextInput = login.find(TextInputLato).first();
            expect(emailTextInput.prop("placeholder")).to.equal("Email");
        });

        it("call the `onChangeText` function with correct parameter and on correct instance", () => {
            const onChangeTextSpy = sinon.spy();
            Login.prototype.onChangeText = onChangeTextSpy;
            const login = shallow(<Login asteroid={asteroid} />);
            const emailTextInput = login.find(TextInputLato).first();
            const instance = login.instance();
            emailTextInput.simulate("changeText", "inputText");
            expect(onChangeTextSpy).to.have.been.calledWithExactly("email", "inputText");
            expect(onChangeTextSpy).to.have.been.calledOn(instance);
        });

        it("renders the correct `value`", () => {
            const login = shallow(<Login asteroid={asteroid} />);
            login.setState({email: "email"});
            const emailTextInput = login.find(TextInputLato).first();
            expect(emailTextInput.prop("value")).to.equal("email");
        });

    });

    describe("`TextInput` password field", () => {

        it("renders the correct placeholder", () => {
            const login = shallow(<Login asteroid={asteroid} />);
            const passwordTextInput = login.find(TextInputLato).last();
            expect(passwordTextInput.prop("placeholder")).to.equal("Password");
        });

        it("call the `onChangeText` function with correct parameter and on correct instance", () => {
            const onChangeTextSpy = sinon.spy();
            Login.prototype.onChangeText = onChangeTextSpy;
            const login = shallow(<Login asteroid={asteroid} />);
            const passwordTextInput = login.find(TextInputLato).last();
            const instance = login.instance();
            passwordTextInput.simulate("changeText", "inputText");
            expect(onChangeTextSpy).to.have.been.calledWithExactly("password", "inputText");
            expect(onChangeTextSpy).to.have.been.calledOn(instance);
        });

        it("renders the correct `value`", () => {
            const login = shallow(<Login asteroid={asteroid} />);
            login.setState({password: "password"});
            expect(login.find(TextInputLato).last().prop("value")).to.equal("password");
        });

    });

    describe("`onLogin` function", () => {

        const onLogin = Login.prototype.onLogin;

        it("call `asteroid.login` function with correct credentials", () => {
            const login = sinon.stub().returns(Promise.resolve());
            const setLoginError = sinon.spy();
            const instance = {
                state: {
                    email: "email",
                    password: "password"
                },
                props: {
                    asteroid: {
                        login
                    }
                },
                setLoginError
            };
            onLogin.call(instance);
            expect(login).to.have.callCount(1);
            expect(login).to.have.been.calledWithExactly({
                sso: {
                    username: "email",
                    password: "password"
                }
            });
        });

        it("call `setLoginError` function with `null`", () => {
            const login = sinon.stub().returns(Promise.resolve());
            const setLoginError = sinon.spy();
            const instance = {
                state: {
                    email: "email",
                    password: "password"
                },
                props: {
                    asteroid: {
                        login
                    }
                },
                setLoginError
            };
            onLogin.call(instance);
            expect(setLoginError).to.have.callCount(1);
            expect(setLoginError).to.have.been.calledWithExactly(null);
        });

        it("call `setLoginError` function with an `error` if promise is rejected", () => {
            const login = sinon.stub().returns(Promise.reject(new Error("Login Error")));
            const setLoginError = sinon.spy();
            const instance = {
                state: {
                    email: "email",
                    password: "password"
                },
                props: {
                    asteroid: {
                        login
                    }
                },
                setLoginError
            };
            onLogin.call(instance);
            return login()
                .catch(() => {
                    expect(setLoginError).to.have.callCount(2);
                    expect(setLoginError.secondCall).to.have.calledOn(instance);
                    expect(setLoginError.secondCall).to.have.been.calledWithExactly(new Error("Login Error"));
                });
        });

    });

    describe("`setLoginError` function", () => {

        const setLoginError = Login.prototype.setLoginError;

        it("call `setState` function with correct parameter [CASE: args `null`]", () => {
            const setState = sinon.spy();
            const instance = {
                setState
            };
            setLoginError.call(instance, null);
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.calledWithExactly({loginError: false});
        });

        it("call `setState` function with correct parameter [CASE: args Error]", () => {
            const setState = sinon.spy();
            const instance = {
                setState
            };
            setLoginError.call(instance, new Error("Login Error"));
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.calledWithExactly({loginError: true});
        });

    });

    describe("`onChangeText` function", () => {

        const onChangeText = Login.prototype.onChangeText;

        it("call `setState` function with correct parameter", () => {
            const setState = sinon.spy();
            const instance = {
                setState
            };
            onChangeText.call(instance, "email", "email");
            expect(setState).to.have.callCount(1);
            expect(setState).to.have.calledWithExactly({email: "email"});
        });

    });

    describe("`renderErrorLogin` function", () => {

        const renderErrorLogin = Login.prototype.renderErrorLogin;

        it("should render a React element if `loginError` is true", () => {
            const instance = {
                state: {
                    loginError: true
                }
            };
            const ErrorLogin = renderErrorLogin.call(instance);
            expect(TestUtils.isElement(ErrorLogin)).to.equal(true);
        });

        it("should render a React element if `loginError` is false", () => {
            const instance = {
                state: {
                    loginError: false
                }
            };
            const ErrorLogin = renderErrorLogin.call(instance);
            expect(ErrorLogin).to.equal(null);
        });

    });

});
