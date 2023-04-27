import React from 'react';
import {
  tabBarIcon,
  tabBarIconHaveNoty,
  BottomTabNavigator,
} from '../components';

import Home from '../../screens/Home';
import Project from '../../screens/Project';
import ProjectView from '../../screens/ProjectView';
import ProjectCreate from '../../screens/ProjectCreate';
import TaskCreate from '../../screens/TaskCreate';
import TaskView from '../../screens/TaskView';
import Task from '../../screens/Task';
import Filter from '../../screens/Filter';
// import Profile from '../../screens/Profile';
// import PSelectAssignee from '../../screens/PSelectAssignee';

export const NewsTabScreens = {
  Home: {
    component: Home,
    options: {
      title: 'home',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'home'}),
    },
  },
  Project: {
    component: Project,
    options: {
      title: 'project',
      tabBarIcon: ({color}) => tabBarIcon({color, name: 'briefcase'}),
    },
  },
  Tasks: {
    component: Task,
    options: {
      title: 'tasks',
      tabBarIcon: ({color}) => tabBarIconHaveNoty({color, name: 'tasks'}),
    },
  },
  // Profile: {
  //   component: Profile,
  //   options: {
  //     title: 'account',
  //     tabBarIcon: ({color}) => tabBarIcon({color, name: 'user-circle'}),
  //   },
  // },
};

const ProjectMenu = () => <BottomTabNavigator tabScreens={NewsTabScreens} />;

export default {
  ProjectMenu: {
    component: ProjectMenu,
    options: {
      title: 'home',
    },
  },
  // PSelectAssignee: {
  //   component: PSelectAssignee,
  //   options: {
  //     title: 'select_assignee',
  //   },
  // },
  ProjectView: {
    component: ProjectView,
    options: {
      title: 'project_view',
    },
  },
  ProjectCreate: {
    component: ProjectCreate,
    options: {
      title: 'create_project',
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
