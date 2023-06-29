import classNames from 'classnames/bind';
import styles from './Login.module.scss';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { BsFacebook } from 'react-icons/bs';
import jwt_decode from 'jwt-decode';

import Button from '~/components/Button';
import InputForm from '~/components/InputForm';
import * as UserService from '~/service/UserService';
import { useMutationHooks } from '~/hooks/useMutationHook';
import Loading from '~/components/LoadingComponent';
import { useDispatch } from 'react-redux';
import { updateUser } from '~/redux/slides/userSlide';
const cx = classNames.bind(styles);
function Login() {
    const navigate = useNavigate();
    const handleNavigateRegister = () => {
        navigate('/register');
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    //lấy dữ liệu từ dâta bằng react query
    const mutation = useMutationHooks((data) => UserService.loginUser(data));
    const { data, isLoading, isSuccess, isError } = mutation;
    //

    useEffect(() => {
        if (isSuccess && data?.status !== 'ERR') {
            navigate('/');
            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwt_decode(data?.access_token);
                console.log('decoded', decoded);
                if (decoded?.id) {
                    handleGetDetailUser(decoded?.id, data?.access_token);
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSuccess, isError]);
    const handleGetDetailUser = async (id, token) => {
        const res = await UserService.getDetailUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    };
    // useEffect(() => {
    //     if (isSuccess) {
    //         navigate('/');
    //         localStorage.setItem('access_token', JSON.stringify(data?.access_token));
    //         if (data?.access_token) {
    //             const decoded = jwt_decode(data?.access_token);
    //             if (decoded?.id) {
    //                 handleGetDetailUser(decoded?.id, decoded?.access_token);
    //                 console.log(decoded);
    //             }
    //         }
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [isSuccess]);

    // const handleGetDetailUser = async (id, token) => {
    //     const res = await UserService.getDetailUser(id, token);
    //     dispatch(updateUser({ ...res?.data, access_token: token }));
    // };
    //lấy dữ liệu từ form login
    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangePassWord = (value) => {
        setPassword(value);
    };
    const handleSignIn = () => {
        mutation.mutate({
            email,
            password,
        });
    };
    //
    return (
        <div className={cx('wrapper')}>
            <div className={cx('form-login')}>
                <div className={cx('title')}>
                    <h3 className={cx('title-login')}>Đăng nhập</h3>
                    <h3 onClick={handleNavigateRegister} className={cx('title-login')}>
                        Đăng ký
                    </h3>
                </div>
                <form method="post" action="">
                    <div className={cx('form-group')}>
                        <label htmlFor="name" className={cx('form-label')}>
                            Số điện thoại/Email
                        </label>
                        <div className={cx('form-input')}>
                            <InputForm
                                value={email}
                                onChange={handleOnchangeEmail}
                                type="text"
                                placeholder="Nhập số điện thoại hoặc email"
                                className={cx('form-control')}
                                id="name"
                            />
                        </div>
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="name" className={cx('form-label')}>
                            Mật khẩu
                        </label>
                        <div className={cx('form-input')}>
                            <InputForm
                                value={password}
                                onChange={handleOnchangePassWord}
                                type="password"
                                placeholder="Nhập số điện thoại"
                                className={cx('form-control')}
                                id="name"
                            />
                        </div>
                    </div>
                </form>
                <span>Quên mật khẩu</span>
                {data?.status === 'ERR' && <span style={{ color: 'red' }}>{data?.message}</span>}
                <Loading isLoading={isLoading}>
                    <Button login className={cx('btn-login')} onClick={handleSignIn}>
                        Đăng nhập
                    </Button>
                </Loading>

                <Button facebook leftIcon={<BsFacebook />} className={cx('btn-fb')}>
                    Đăng nhập bằng facebook
                </Button>
            </div>
        </div>
    );
}

export default Login;
