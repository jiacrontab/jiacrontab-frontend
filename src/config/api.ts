const API = {
    AppInit: {
        method: 'post',
        url: '/v1/app/init'
    },
    LoginConfig: {
        method: 'post',
        url: '/v1/user/login'
    },
    ActivityList: {
        method: 'post',
        url: '/v2/user/activity_list'
    },
    JobHistory: {
        method: 'post',
        url: '/v2/user/job_history'
    },
    logInfo: {
        method: 'post',
        url: '/v2/log/info'
    },
    CleanLog: {
        method: 'post',
        url: '/v2/log/clean'
    },
    CleanNodeLog: {
        method: 'post',
        url: '/v2/node/clean_log'
    },
    NodeList: {
        method: 'post',
        url: '/v2/node/list'
    },
    LoginOut: {
        method: 'post',
        url: '/v1/user/logout'
    },
    CrontabList: {
        method: 'post',
        url: '/v2/crontab/job/list'
    },
    DaemonList: {
        method: 'post',
        url: '/v2/daemon/job/list'
    },
    edit: {
        method: 'post',
        url: '/v2/crontab/job/edit'
    },
    daemonEdit: {
        method: 'post',
        url: '/v2/daemon/job/edit'
    },
    getTaskList: {
        method: 'post',
        url: '/v2/crontab/job/get'
    },
    getDaemonData: {
        method: 'post',
        url: '/v2/daemon/job/get'
    },
    action: {
        method: 'post',
        url: '/v2/crontab/job/action'
    },
    auditJob: {
        method: 'post',
        url: '/v2/user/audit_job'
    },
    daemonAction: {
        method: 'post',
        url: '/v2/daemon/job/action'
    },
    exec: {
        method: 'post',
        url: '/v2/crontab/job/exec'
    },
    crontabLog: {
        method: 'post',
        url: '/v2/crontab/job/log'
    },
    daemonLog: {
        method: 'post',
        url: '/v2/daemon/job/log'
    },
    userList: {
        method: 'post',
        url: '/v2/user/list'
    },
    groupUser: {
        method: 'post',
        url: '/v2/user/group_user'
    },
    groupNode: {
        method: 'post',
        url: '/v2/node/group_node'
    },
    groupList: {
        method: 'post',
        url: '/v2/group/list'
    },
    editGroup: {
        method: 'post',
        url: '/v2/group/edit'
    },
    userStat: {
        method: 'post',
        url: '/v2/user/stat'
    },
    nodeDelete: {
        method: 'post',
        url: '/v2/node/delete'
    },
    configGet: {
        method: 'post',
        url: '/v2/config/get'
    },
    configSend: {
        method: 'post',
        url: '/v2/config/mail/send'
    },
    userSignup: {
        method: 'post',
        url: '/v2/user/signup'
    },
    editUser: {
        method: 'post',
        url: '/v2/user/edit'
    },
    deleteUser: {
        method: 'post',
        url: '/v2/user/delete'
    },
    systemInfo: {
        method: 'post',
        url: '/v2/system/info'
    }
}

export default API
