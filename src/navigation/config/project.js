import React from 'react';
import {
  tabBarIcon,
  tabBarIconHaveNoty,
  BottomTabNavigator,
} from '../components';

import Home from '../../screens/Home';
import TaskCreate from '../../screens/TaskCreate';
import TaskView from '../../screens/TaskView';
import Task from '../../screens/Task';
import Filter from '../../screens/Filter';
import Login from '../../screens/Auth/Login';
import ViewScreen from '../../screens/ViewScreen';
import Profile from '../../screens/Profile';
import CheckOutScreen from '../../screens/CheckOutScreen';

export const NewsTabScreens = {
  Home: {
    component: Home,
    options: {
      title: 'home',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'home'}),
    },
  },
  Tasks: {
    component: Task,
    options: {
      title: 'tasks',
      tabBarIcon: ({color}) => tabBarIconHaveNoty({color, name: 'tasks'}),
    },
  },
  Profile: {
    component: Profile,
    options: {
      title: 'profile',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'user'}),
    },
  },
};

const ProjectMenu = () => <BottomTabNavigator tabScreens={NewsTabScreens} />;

export default {
  Login: {
    component: Login,
    options: {
      title: 'Login',
    },
  },
  ProjectMenu: {
    component: ProjectMenu,
    options: {
      title: 'home',
    },
  },
  ViewScreen: {
    component: ViewScreen,
  },
  CheckOutScreen: {
    component: CheckOutScreen,
  },
  TaskCreate: {
    component: TaskCreate,
    options: {
      title: 'create_task',
    },
  },
  Filter: {
    component: Filter,
    options: {
      title: 'filter',
    },
  },
  TaskView: {
    component: TaskView,
    options: {
      title: 'task_view',
    },
  },
  Profile: {
    component: Profile,
    options: {
      title: 'profile',
    },
  },
};
