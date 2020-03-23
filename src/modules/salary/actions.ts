import { ActionTree } from 'vuex';
import store, { RootState } from '@/store';
import axios from 'axios';

import { getResponseData } from '@/stuff';

import {
    IEventSalary,
    IEventSalaryState,
    EVENT_SALARY_FETCH_ALL,
    EVENT_SALARY_FETCH_ONE,
    EVENT_SALARY_COMMIT,
    EVENT_SALARY_DELETE,
    EVENT_SHIFT_SALARY_COMMIT,
    EVENT_SHIFT_SALARY_DELETE,
    EVENT_PLACE_SALARY_COMMIT,
    EVENT_PLACE_SALARY_DELETE,
    EVENT_SALARY_COMMIT_NEW
} from './types';

export const actions: ActionTree<IEventSalaryState, RootState> = {
    [EVENT_SALARY_FETCH_ALL]: () => {
        return new Promise((resolve, reject) => {
            axios.get('/salary/v1/event')
                .then((response) => getResponseData<IEventSalary>(response))
                .then((eventSalary) => {
                    // console.log(eventSalary);
                    resolve(eventSalary);
                })
                .catch((error) => {
                    console.log(EVENT_SALARY_FETCH_ALL, error);
                    reject(error);
                });
        });
    },

    [EVENT_SALARY_FETCH_ONE]: ({ }, eventId: string) => {
        return new Promise((resolve, reject) => {
            axios.get(`/salary/v1/event/${eventId}`)
                .then((response) => getResponseData<IEventSalary>(response))
                .then((eventSalary) => {
                    // console.log(eventSalary);
                    resolve(eventSalary);
                })
                .catch((error) => {
                    console.log(EVENT_SALARY_FETCH_ONE, error);
                    reject(error);
                });
        });
    },

    // [EVENT_SALARY_COMMIT]: ({ }, eventSalary: IEventSalary) => {
    //     console.log(eventSalary);
    //     // const requestData = {
    //     //     eventSalary: eventSalary.eventId,
    //     //     shiftSalaries: eventSalary.shiftSalaries,
    //     //     placeSalaries: eventSalary.placeSalaries,
    //     //     count: eventSalary.count,
    //     //     description: eventSalary.description
    //     // };
    //     return new Promise((resolve, reject) => {
    //         const request = axios.put(`/salary/v1/event/${eventSalary.eventId}`, eventSalary);
    //         // : axios.put(`https://dev.rtuitlab.ru/salary/v1/event/${data.eventId}`,
    //         //     {count: data.eventSalary.count, description: data.eventSalary.description});
    //         request
    //             .then((response) => {
    //                 // console.log(response);
    //                 resolve(response);
    //             })
    //             .catch((error) => {
    //                 console.log(EVENT_SALARY_COMMIT, error);
    //                 reject(error);
    //             });
    //     });
    // },

    [EVENT_SALARY_COMMIT]: ({ }, eventSalary: IEventSalary | any) => {
        return new Promise((resolve, reject) => {
            let request;
            if (eventSalary.isNew) {
                delete eventSalary.isNew;
                request = axios.post(`/salary/v1/event/${eventSalary.eventId}`, eventSalary);
            } else if (eventSalary.isNew === undefined) {
                request = axios.put(`/salary/v1/event/${eventSalary.eventId}`, eventSalary);
            }
            if (request) {
                request
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        console.log(EVENT_SALARY_COMMIT_NEW, error);
                        reject(error);
                    });
            }
        });
    }
};
