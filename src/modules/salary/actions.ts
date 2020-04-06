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
                    resolve(eventSalary);
                })
                .catch((error) => {
                    resolve(false);
                });
        });
    },

    [EVENT_SALARY_COMMIT]: ({ }, eventSalary: IEventSalary | any) => {

        const id = eventSalary.eventId;
        delete eventSalary.eventId;

        return new Promise((resolve, reject) => {
            axios.put(`/salary/v1/event/${id}`, eventSalary)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log(EVENT_SALARY_COMMIT, error);
                    reject(error);
                });
        });
    },

    [EVENT_SALARY_DELETE]: ({ }, id: string) => {
        return new Promise((resolve, reject) => {
            axios.delete(`/salary/v1/event/${id}`)
            .then((response) => {
                resolve(response);
            })
            .catch((error) => {
                console.log(EVENT_SALARY_DELETE, error);
                reject(error);
            });
        });
    }
};
