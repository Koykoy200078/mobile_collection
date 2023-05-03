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
};
