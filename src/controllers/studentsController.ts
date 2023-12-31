

//Código do banco do Chico-Raniel

import { Response, Request, NextFunction } from "express";
import Student from "../models/Student";
import { createDbConnection } from "../db/dbConfig";
import { Database } from "sqlite3";
import logger from "../services/logger";
import createHttpError from "http-errors";

let db: Database = createDbConnection();
//const dbPromise = initializeDatabase();

/*export const addStudentsHandler = async () => {
    const db = await dbPromise;
    let student: Student = req.body;
    //let roomToUppercase: string = student.room.toUpperCase();
    const studentsAdded = await db.all(`INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`);
    return studentsAdded;
  };*/


const studentsRoot = (req: Request, res: Response, next: NextFunction) => {
    res.sendStatus(201);
}

/*meu código de handler
export const getAllStudentsHandler = async () => {
    const db = await dbPromise;
    const students = await db.all("SELECT * FROM students");
    return students;
  };*/

  //handler do prof
  const studentsListHandler = async() => {
    let studentsList: Student[] = [];

    let sql = `SELECT * FROM students`;

    const promise = new Promise ((resolve,reject) => {
    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            logger.error(error.message);
            throw createHttpError.InternalServerError("Erro interno do servidor");
        }
        rows.forEach((row: Student) => { 
            studentsList.push(row);
         });
         resolve(studentsList);
        });
    });
    return promise as Promise<Student[]>;
};

const studentsList = async (req: Request, res: Response) => {
    const studentList = await studentsListHandler();

    logger.info(req);

    res.send(studentsList);
};

const studentsListByYearAndRoom = (req: Request, res: Response) => {
    logger.info(req);
    let studentsList: Student[] = [];
    let year = req.query.year;
    let room = req.query.room?.toString().toUpperCase();

    let sql = `SELECT * FROM students WHERE year="${year}" AND room="${room}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            rows.forEach((row: Student) => { studentsList.push(row) });
            res.send(studentsList);
        } else {
            res.send("Os parâmetros apresentados não rertonaram resultado.");
        }

    })
}

const studentDetailsByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const studentDetailsByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `SELECT * FROM students WHERE id="${id}"`;

    db.all(sql, [], (error: Error, rows: Student[]) => {
        if (error) {
            res.send(error.message);
        }
        if (rows.length > 0) {
            res.send(rows[0]);
        } else {
            res.send("Estudante não existe");
        }

    }
    );
}

const addStudent = (req: Request, res: Response) => {
    logger.info(req);

    let token = req.headers.authorization;

    if (token == "Bearer 12345") {
        let student: Student = req.body;
        let roomToUppercase: string = student.room.toUpperCase();

        let sql = `INSERT INTO students(name, shift, year, room) VALUES ("${student.name}", "${student.shift}", "${student.year}", "${roomToUppercase}")`;

        if (student.name && student.shift && student.year && student.room) {
            db.run(sql,
                (error: Error) => {
                    if (error) {
                        res.end(error.message);
                    }
                    res.send(`Student ${student.name} Added`);
                })
        } else {
            res.send("Erro na criação do estudante. Verifique se todos os campos foram preenchidos");
        }
    } else {
        res.sendStatus(403);
    }



}

const updateStudent = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let roomToUppercase = student.room.toUpperCase();
    let sql = `UPDATE students SET name="${student.name}", 
                                   shift="${student.shift}", 
                                   year="${student.year}",
                                   room="${roomToUppercase}"
                                   WHERE id="${student.id}"
                                   `;


    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    });
}

const updateStudentBySpecificField = (req: Request, res: Response) => {
    logger.info(req);
    let student: Student = req.body;
    let sql = `UPDATE students SET name="${student.name}"
                                   WHERE id="${student.id}"
    `
    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Updated");
    })
}

const deleteStudentByQuery = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.query.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    })
}

const deleteStudentByParams = (req: Request, res: Response) => {
    logger.info(req);
    let id = req.params.id;
    let sql = `DELETE from students WHERE id="${id}"`;

    db.all(sql, [], (error: Error) => {
        if (error) {
            res.send(error.message);
        }
        res.send("Student Deleted");
    })
}

export {
    studentsRoot,
    studentsList,
    studentsListByYearAndRoom,
    studentDetailsByQuery,
    studentDetailsByParams,
    addStudent,
    updateStudent,
    updateStudentBySpecificField,
    deleteStudentByQuery,
    deleteStudentByParams,
    studentsListHandler
};