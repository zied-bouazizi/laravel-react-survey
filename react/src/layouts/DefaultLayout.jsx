import { Fragment, useEffect, useRef, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, UserIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios';
import Toast from '../components/Toast';
import ApplicationLogo from '../components/ApplicationLogo';

const navigation = [
  { name: 'Dashboard', to: '/dashboard' },
  { name: 'Surveys', to: '/surveys' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function DefaultLayout() {
  const { currentUser, userToken, setCurrentUser, logout, showToast } = useStateContext()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const knownNotificationIds = useRef(new Set())

  useEffect(() => {
    if (!userToken) return;

    axiosClient.get('/me')
     .then(({data}) => {
        setCurrentUser(data.user);
     })
  }, [userToken, setCurrentUser]);

  useEffect(() => {
    if (!userToken) return undefined;

    const fetchNotifications = () => {
      axiosClient.get('/notifications')
        .then(({ data }) => {
          const receivedNotifications = data.notifications || [];
          const incomingIds = new Set(receivedNotifications.map((notification) => notification.id));

          if (knownNotificationIds.current.size > 0) {
            receivedNotifications
              .filter((notification) => !knownNotificationIds.current.has(notification.id))
              .forEach((notification) => showToast(notification.message));
          }

          knownNotificationIds.current = incomingIds;
          setNotifications(receivedNotifications);
          setUnreadCount(data.unread_count || 0);
        });
    };

    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 15000);

    return () => clearInterval(intervalId);
  }, [userToken, showToast]);

  const markNotificationsAsRead = () => {
    if (unreadCount === 0) {
      return;
    }

    axiosClient.post('/notifications/mark-as-read')
      .then(() => {
        setUnreadCount(0);
        setNotifications((prev) => prev.map((notification) => ({ ...notification, read_at: notification.read_at || new Date().toISOString() })));
      });
  };

  const handleLogout = (ev) => {
    ev.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        logout();
      });
  }

  if(!userToken) {
    return <Navigate to="/" />
  }

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open, close }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link
                        to="/dashboard"
                        onClick={() => open && close()}
                      >
                        <ApplicationLogo className="h-8 w-8" />
                    </Link>
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <NavLink
                            key={item.name}
                            to={item.to}
                            className={({ isActive }) => classNames(
                              isActive
                                ? 'bg-gray-900 text-white'
                                : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium'
                            )}
                          >
                            {item.name}
                          </NavLink>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6 gap-3">
                      <Menu as="div" className="relative">
                        <div>
                          <Menu.Button
                            onClick={markNotificationsAsRead}
                            className="relative rounded-full p-2 text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
                          >
                            <span className="sr-only">Open notifications</span>
                            <BellIcon className="h-6 w-6" />
                            {unreadCount > 0 && (
                              <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-semibold leading-5 text-white">
                                {unreadCount}
                              </span>
                            )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <div className="px-4 py-2 border-b border-gray-100 text-sm font-semibold text-gray-700">Survey notifications</div>
                            <div className="max-h-80 overflow-auto">
                              {notifications.length === 0 && (
                                <p className="px-4 py-3 text-sm text-gray-500">No notifications yet.</p>
                              )}
                              {notifications.map((notification) => (
                                <div key={notification.id} className={classNames('px-4 py-3 text-sm border-b border-gray-100', !notification.read_at ? 'bg-sky-50' : 'bg-white')}>
                                  <p className="text-gray-800">{notification.message}</p>
                                  <p className="text-xs text-gray-500 mt-1">{new Date(notification.created_at).toLocaleString()}</p>
                                </div>
                              ))}
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>

                      <Menu as="div" className="relative ml-1">
                        <div>
                          <Menu.Button className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                            <span className="sr-only">Open user menu</span>
                            <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                             <div className="px-4 py-3 border-b border-gray-200">
                              <div className="flex items-center">
                                <UserIcon className="w-8 h-8 bg-black p-2 rounded-full text-white" />
                                <div className="ml-3">
                                  <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                                  <p className="text-xs text-gray-500">{currentUser.email}</p>
                                </div>
                              </div>
                            </div>
                            <Menu.Item>
                              <a
                                href="#"
                                onClick={handleLogout}
                                className="block px-4 py-2 text-sm text-gray-700"
                              >
                                Sign out
                              </a>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                {({ close }) => (
                  <>
                    <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                      {navigation.map((item) => (
                        <NavLink
                          key={item.name}
                          to={item.to}
                          className={({ isActive }) => classNames(
                              isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                              'block px-3 py-2 rounded-md text-base font-medium'
                            )}
                          onClick={() => close()}
                        >
                          {item.name}
                        </NavLink>
                      ))}
                    </div>
                    <div className="border-t border-gray-700 pt-4 pb-3">
                      <div className="flex items-center px-5">
                        <div className="flex-shrink-0">
                          <UserIcon className="w-8 h-8 bg-black/25 p-2 rounded-full text-white" />
                        </div>
                        <div className="ml-3">
                          <div className="text-base font-medium leading-none text-white">{currentUser.name}</div>
                          <div className="text-sm font-medium leading-none text-gray-400">{currentUser.email}</div>
                        </div>
                      </div>
                      <div className="mt-3 space-y-1 px-2">
                        <Disclosure.Button
                          as="a"
                          href="#"
                          onClick={handleLogout}
                          className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                        >
                          Sign out
                        </Disclosure.Button>
                      </div>
                    </div>
                  </>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
        <Outlet />
        <Toast />
      </div>
    </>
  )
}
