import { HttpClient, HttpEventType, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, throwError } from "rxjs";
import { map, catchError, tap } from 'rxjs/operators';

import { Post } from "./post.model";

@Injectable({ providedIn: 'root' })
export class PostService {

    urlFirebase = 'https://ng-recipe-book-b7ff1.firebaseio.com/posts.json';
    // pour voir les erreurs du coté des composants qui appel l'api
    error = new Subject<string>();

    constructor(private http: HttpClient) { }

    createAndStorePost(postData: Post) {
        console.log(postData);

        this.http.post<{ name: string }>(this.urlFirebase, postData,
            //pour avoir toute la reponse car par default il n'envoi que le body
            {
                observe: 'response',
                responseType: 'json'
            })
            .subscribe(responseData => {
                //console.log(responseData);
                console.log(responseData.body);
            }, (error => this.error.next(error))
            );
    }

    fetchsPost() {
        let searchParams = new HttpParams();
        searchParams = searchParams.append('print', 'pretty');
        searchParams = searchParams.append('custom', 'key');

        //le subscribe va se faire coté composant lors de l'appel
        return this.http.get<{ [key: string]: Post }>(this.urlFirebase,{
            headers: new HttpHeaders({'Custom-header': 'Hello'}),
            //firebaseio.com/posts.json?print=pretty // on peut faire plusieur set successive
            //params: new HttpParams().set('print', 'pretty')
            params: searchParams    
        })
            // le pipe permet de transformer le retour en tab de Post
            .pipe(map(resp => {
                const postArray: Post[] = [];
                for (const key in resp) {
                    if (resp.hasOwnProperty(key))
                        postArray.push({ ...resp[key], id: key });
                }
                return postArray;
            }), catchError(errorRes => {
                // send to analitycs server
                return throwError(errorRes);
            }))
            /*.subscribe(responseData => {
                //this.isFetching = false;
                //this.loadedPosts = responseData;
                console.log(responseData);
            })*/
            ;
    }

    deletePosts(){
        return this.http.delete(this.urlFirebase, {
            observe: 'events',
            responseType: 'json'
        }).pipe(tap(event => {
            console.log(event);
            if(event.type === HttpEventType.Response) console.log(event);
        }));
    }
}